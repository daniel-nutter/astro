import {
    Prop,
    Watch,
    Element,
    Component,
    Host,
    h,
    State,
    Event,
    EventEmitter,
    Method,
    Listen,
} from '@stencil/core'
import {
    Placement,
    computePosition,
    arrow,
    offset,
    flip,
    autoUpdate,
    autoPlacement,
} from '@floating-ui/dom'

/**
 * @slot (default) - The contents for rux-pop-up
 * @slot trigger - The trigger element for rux-pop-up
 *
 * @part container - the container of rux-pop-up
 * @part trigger-container - the container of the pop-up trigger
 * @part popup-content - the content that is shown when rux-pop-up is opened
 * @part arrow - the arrow pointing to the trigger of rux-pop-up
 */

export declare type ExtendedPlacement = Placement | 'auto'

@Component({
    tag: 'rux-pop-up',
    styleUrl: 'rux-pop-up.scss',
    shadow: true,
})
export class RuxPopUp {
    private trigger!: HTMLElement
    private content!: HTMLElement
    private arrowEl!: HTMLElement
    private _positionerCleanup: ReturnType<typeof autoUpdate> | undefined

    @Element() el!: HTMLRuxPopUpElement

    /**
     * Determines if the pop up is open or closed
     */
    @Prop({ mutable: true, reflect: true }) open = false

    /**
     * The placement of the pop up relative to it's slotted trigger element. Defaults to auto.
     */
    @Prop() placement: ExtendedPlacement = 'auto'

    /**
     * The position strategy of the popup, either absolute or fixed.
     */
    @Prop() strategy: 'absolute' | 'fixed' = 'absolute'

    /**
     * When provided, will close the pop-up when a single selection is made.
     */
    @Prop({ attribute: 'close-on-select' }) closeOnSelect: boolean = false

    @State() arrowPosition?: string

    /**
     * Emits when the pop up has opened
     */
    @Event({ eventName: 'ruxpopupopened' })
    ruxPopUpOpened!: EventEmitter
    /**
     * Emits when the pop up has closed.
     */
    @Event({ eventName: 'ruxpopupclosed' })
    ruxPopUpClosed!: EventEmitter

    @Watch('open')
    handleOpen() {
        if (this.open) {
            this.content.style.display = 'block'
            this._startPositioner()
            this.ruxPopUpOpened.emit()
            window.addEventListener('mousedown', (e: MouseEvent) =>
                this._handleOutsideClick(e)
            )
        } else {
            this.content.style.display = ''
            this._stopPositioner()
            this.ruxPopUpClosed.emit()
            window.removeEventListener('mousedown', (e: MouseEvent) =>
                this._handleOutsideClick(e)
            )
        }
    }

    /**
     * Opens the pop up and returns true.
     */
    @Method()
    async show() {
        if (this.open) {
            return this.open
        } else this.open = true
        return this.open
    }

    /**
     * Closes the pop up and returns false.
     */
    @Method()
    async hide() {
        if (!this.open) {
            return this.open
        } else this.open = false
        return this.open
    }

    connectedCallback() {
        this._handleTriggerClick = this._handleTriggerClick.bind(this)
        this._handleOutsideClick = this._handleOutsideClick.bind(this)
    }

    componentDidRender() {
        if (this.open) {
            this._startPositioner()
        }
    }

    private async _handleTriggerClick() {
        this.open = !this.open
    }

    private _position() {
        if (!this.open || !this.triggerSlot || !this.content) {
            return
        }
        computePosition(this.triggerSlot, this.content, {
            //@ts-ignore
            placement: this.placement,
            strategy: this.strategy,
            middleware: [
                offset(12),
                this.placement === 'auto'
                    ? autoPlacement({ alignment: 'start' })
                    : flip(),
                arrow({ element: this.arrowEl }),
            ],
        }).then(({ x, y, placement, middlewareData }) => {
            Object.assign(this.content.style, {
                left: `${x}px`,
                top: `${y}px`,
            })

            //@ts-ignore
            const { x: arrowX, y: arrowY } = middlewareData.arrow

            const staticSide = {
                top: 'bottom',
                right: 'left',
                bottom: 'top',
                left: 'right',
            }[placement.split('-')[0]]
            Object.assign(this.arrowEl!.style, {
                left: arrowX != null ? `${arrowX}px` : '',
                top: arrowY != null ? `${arrowY}px` : '',
                right: '',
                bottom: '',
                //@ts-ignore
                [staticSide]: '-6px',
            })
        })
        this._setArrowPosition()
    }

    private _startPositioner() {
        this._stopPositioner()
        if (this.open) {
            this._position()
            this._positionerCleanup = autoUpdate(
                this.triggerSlot,
                this.content,
                this._position.bind(this)
            )
        }
    }

    private async _setArrowPosition() {
        const arrowPos = await this._determineArrowPosition()
        if (this.arrowPosition === arrowPos) {
            return
        } else this.arrowPosition = arrowPos
    }

    private async _determineArrowPosition() {
        if (!this.open) {
            return
        }

        const triggerElRect = await this.getTriggerRect()
        const arrowDivRect = await this.getArrowRect()

        if (
            triggerElRect.bottom > arrowDivRect.bottom &&
            triggerElRect.top < arrowDivRect.top
        ) {
            if (triggerElRect.right > arrowDivRect.right) {
                return 'left'
            } else {
                return 'right'
            }
        } else {
            if (triggerElRect.bottom > arrowDivRect.bottom) {
                return 'top'
            } else {
                return 'bottom'
            }
        }
    }
    private async getTriggerRect() {
        return this.triggerSlot.getBoundingClientRect()
    }
    private async getArrowRect() {
        return this.arrowEl?.getBoundingClientRect()
    }

    private _stopPositioner() {
        if (this._positionerCleanup) {
            this._positionerCleanup()
            this._positionerCleanup = undefined
        }
    }

    private _handleOutsideClick(e: MouseEvent) {
        const menuClick = e.composedPath().includes(this.contentSlot)
        const triggerClick = e.composedPath().includes(this.triggerSlot)
        const popUpClick = e.composedPath().includes(this.el)
        if (!menuClick && !triggerClick && !popUpClick) {
            this.open = false
        }
    }

    @Listen('ruxmenuselected')
    handleSelection() {
        if (this.closeOnSelect) {
            this.open = false
        }
    }

    get contentSlot() {
        return this.content
            ?.querySelector('slot')!
            .assignedElements({ flatten: true })[0]
    }

    get triggerSlot() {
        return this.trigger
            ?.querySelector('slot')!
            .assignedElements({ flatten: true })[0]
    }

    get hasMenu(): boolean {
        //@ts-ignore
        return !!this.content
            ?.querySelector('slot')
            .assignedElements({ flatten: true })
            .filter(
                (el) => el.tagName.toLowerCase() === 'rux-menu'
            )[0] as HTMLRuxMenuElement
    }

    render() {
        return (
            <Host aria-hidden={this.open ? 'false' : 'true'}>
                <div class="rux-popup" part="container">
                    <div
                        onClick={this._handleTriggerClick}
                        class="rux-popup__trigger"
                        ref={(el) => (this.trigger = el!)}
                        part="trigger-container"
                    >
                        <slot name="trigger"></slot>
                    </div>

                    <div
                        class={{
                            'rux-popup__arrow-left':
                                this.arrowPosition === 'left',
                            'rux-popup__arrow-top':
                                this.arrowPosition === 'top',
                            'rux-popup__arrow-right':
                                this.arrowPosition === 'right',
                            'rux-popup__arrow-bottom':
                                this.arrowPosition === 'bottom',
                            'rux-popup__content': true,
                            'rux-popup__content--menu': this.hasMenu,
                            hidden: this.open === false,
                        }}
                        part="popup-content"
                        ref={(el) => (this.content = el!)}
                    >
                        <div
                            class="rux-popup-arrow"
                            ref={(el) => (this.arrowEl = el!)}
                            part="arrow"
                        ></div>

                        <slot></slot>
                    </div>
                </div>
            </Host>
        )
    }
}
