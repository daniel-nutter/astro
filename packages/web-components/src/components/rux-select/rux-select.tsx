/* eslint react/jsx-no-bind: 0 */ // --> OFF
import {
    Component,
    Element,
    Host,
    h,
    Prop,
    Event,
    EventEmitter,
    Watch,
    Listen,
    State,
} from '@stencil/core'
import FormFieldMessage from '../../common/functional-components/FormFieldMessage/FormFieldMessage'
import { FormFieldInterface } from '../../common/interfaces.module'
import { hasSlot, renderHiddenSelect } from '../../utils/utils'

/**
 * @slot (default) - The select options
 * @slot label - The select label
 * @part error-text - The error text element
 * @part form-field - The form-field wrapper container
 * @part help-text - The help text element
 * @part label - The select label
 * @part select - The select element
 * @part required - The asterisk when required is true
 */
@Component({
    tag: 'rux-select',
    styleUrl: 'rux-select.scss',
    shadow: true,
})
export class RuxSelect implements FormFieldInterface {
    private slotContainer?: HTMLElement
    private selectEl!: HTMLSelectElement

    @Element() el!: HTMLRuxSelectElement
    @State() hasLabelSlot = false

    /**
     * Disables the select menu via HTML disabled attribute. Select menu takes on a distinct visual state. Cursor uses the not-allowed system replacement and all keyboard and mouse events are ignored.
     */
    @Prop({ reflect: true }) disabled: boolean = false

    /**
     * Sets the field as required
     */
    @Prop({ reflect: true }) required: boolean = false

    /**
     * The select label text. For HTML content, use the `label` slot instead.
     */
    @Prop() label?: string

    /**
     * Id for the Select Input
     */
    @Prop({ attribute: 'input-id' }) inputId?: string

    /**
     * Id for the Label
     */
    @Prop({ attribute: 'label-id' }) labelId?: string

    /**
     * Presentational only. Renders the Select Menu as invalid.
     */
    @Prop({ reflect: true }) invalid: boolean = false

    /**
     * Enables multiselect
     */
    @Prop({ reflect: true }) multiple: boolean = false

    /**
     * Sets the Name of the Input Element
     */
    @Prop({ reflect: true }) name = ''

    /**
     * The value of the selected option. If multiple is true, this is an array.
     */
    @Prop({ mutable: true }) value?: string | string[]

    /**
     * The help or explanation text
     */
    @Prop({ attribute: 'help-text' }) helpText?: string

    /**
     * The validation error text
     */
    @Prop({ attribute: 'error-text' }) errorText?: string

    /**
     * The size of rux-select
     */
    @Prop({ reflect: true }) size?: 'small' | 'medium' | 'large' = 'medium'

    /**
     * Event Emitted when the Value of the Select is Changed
     */
    @Event({ eventName: 'ruxchange' })
    ruxSelectChanged!: EventEmitter<void>

    /**
     * Fired when an element has lost focus - [HTMLElement/blur_event](https://developer.mozilla.org/en-US/docs/Web/API/Element/blur_event)
     */
    @Event({ eventName: 'ruxblur' }) ruxBlur!: EventEmitter

    @Watch('value')
    onValueChange() {
        this._syncOptionsFromValue()
    }

    @Watch('label')
    handleLabelChange() {
        this._handleLabelSlotChange()
    }

    @Listen('rux-option-group-changed')
    handleGroupChange() {
        this._syncOptionsToNativeSelect()
    }

    @Listen('rux-option-changed')
    handleOptionChange() {
        this._syncOptionsToNativeSelect()
    }

    connectedCallback() {
        this._handleSlotChange = this._handleSlotChange.bind(this)
        this._handleLabelSlotChange = this._handleLabelSlotChange.bind(this)
    }

    componentWillLoad() {
        this._handleLabelSlotChange()
        if (this.value) {
            this._handleSlotChange()
        }
    }

    get hasLabel() {
        return this.label ? true : this.hasLabelSlot
    }

    private _onBlur = () => {
        this.ruxBlur.emit()
    }

    private _handleLabelSlotChange() {
        this.hasLabelSlot = hasSlot(this.el, 'label')
    }

    private async _handleSlotChange() {
        await this._syncOptionsToNativeSelect()
        await this._syncOptionsFromValue()
    }

    /**
     * The native select element doesn't play nicely with slots. If an <option> isn't a direct child element, it won't render properly.
     * As a solution, we expose a slot outside the shadow-DOMed <select> and then manually copy the contents inside the shadow DOM.
     *
     * A RuxOptionGroup component is required because onSlotchange won't fire if we use the native <optgroup> and we change just its options.
     * RuxOptionGroup exists only to fire a change event that we can listen to.
     */
    private _syncOptionsToNativeSelect() {
        const slot = this.slotContainer?.querySelector(
            'slot'
        ) as HTMLSlotElement

        if (slot) {
            this.selectEl.innerHTML = ''

            const assignedElements = slot.assignedElements({
                flatten: true,
            }) as HTMLElement[]

            assignedElements.map((item: any) => {
                const option = item
                if (option.tagName.toLowerCase() === 'rux-option') {
                    this._appendOptionToNativeSelect(
                        option.label,
                        option.value,
                        option.disabled,
                        this.selectEl
                    )
                }

                if (option.tagName.toLowerCase() === 'rux-option-group') {
                    const children = [
                        ...Array.from(option.querySelectorAll('rux-option')),
                    ] as HTMLRuxOptionElement[]
                    this._appendOptGroupToNativeSelect(
                        option.label ? option.label : 'Group',
                        children
                    )
                }
            })
        }
        return Promise.resolve()
    }

    private _appendOptGroupToNativeSelect(
        groupName: string,
        children: HTMLRuxOptionElement[]
    ) {
        const group = Object.assign(document.createElement('optgroup'), {
            label: groupName,
        })

        children.map((option: any) => {
            this._appendOptionToNativeSelect(
                option.label,
                option.value,
                option.disabled,
                group
            )
            this.selectEl.appendChild(group)
        })

        this.selectEl.appendChild(group)
    }

    private _appendOptionToNativeSelect(
        label: string,
        value: string,
        disabled: boolean,
        target: HTMLSelectElement | HTMLOptGroupElement
    ) {
        const item = Object.assign(document.createElement('option'), {
            innerHTML: label ? label : '',
            value: value,
            disabled: disabled,
        })
        target.appendChild(item)
    }

    private _syncOptionsFromValue() {
        if (this.selectEl) {
            const options = [
                ...Array.from(this.selectEl.querySelectorAll('option')),
            ]
            options.map((option: HTMLOptionElement) => {
                if (Array.isArray(this.value)) {
                    option.selected = this.value.includes(option.value)
                } else {
                    option.selected = option.value === this.value
                }
            })
        }
        return Promise.resolve()
    }

    private _onChange(e: Event) {
        const target = e.target as HTMLSelectElement

        const values = [...target.options]
            .filter((option) => {
                return option.selected
            })
            .map((option) => {
                return option.value
            })

        if (values.length === 1) {
            this.value = values[0]
        } else {
            this.value = values
        }

        this.ruxSelectChanged.emit()
    }

    private _onClick() {
        const select = this.el.querySelector('select') as HTMLElement
        if (!select.classList.contains('open')) {
            select.classList.add('open')
        } else {
            select.classList.remove('open')
        }
    }

    render() {
        const {
            disabled,
            required,
            label,
            inputId,
            labelId,
            invalid,
            name,
            multiple,
        } = this
        renderHiddenSelect(true, this.el, this.name, this.value, this.disabled)
        return (
            <Host>
                <label
                    id={labelId}
                    htmlFor={inputId}
                    aria-hidden={this.hasLabel ? 'false' : 'true'}
                    part="label"
                >
                    <span class={{ hidden: !this.hasLabel }}>
                        <slot
                            onSlotchange={this._handleLabelSlotChange}
                            name="label"
                        >
                            {label}
                            {this.required && (
                                <span
                                    part="required"
                                    class="rux-label__asterisk"
                                >
                                    &#42;
                                </span>
                            )}
                        </slot>
                    </span>
                </label>
                <select
                    class={{
                        'rux-select': true,
                        'rux-select--small': this.size === 'small',
                        'rux-select--medium': this.size === 'medium',
                        'rux-select--large': this.size === 'large',
                        'rux-select--invalid': invalid,
                        'rux-select--multiple': multiple,
                    }}
                    ref={(el) => (this.selectEl = el as HTMLSelectElement)}
                    id={inputId}
                    disabled={disabled}
                    required={required}
                    multiple={multiple}
                    name={name}
                    onChange={(e) => this._onChange(e)}
                    onClick={this._onClick}
                    onBlur={this._onBlur}
                    part="select"
                ></select>
                <div
                    aria-hidden="true"
                    class="hidden"
                    ref={(el) => (this.slotContainer = el)}
                >
                    <slot onSlotchange={this._handleSlotChange}></slot>
                </div>
                <FormFieldMessage
                    errorText={this.errorText}
                    helpText={this.helpText}
                ></FormFieldMessage>
            </Host>
        )
    }
}
