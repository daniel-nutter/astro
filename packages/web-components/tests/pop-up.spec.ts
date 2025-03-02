import { test, expect } from '@playwright/test'
import { startTestEnv, setBodyContent } from './utils/_startTestEnv'

test.describe('Pop up', async () => {
    startTestEnv()

    test('it renders', async ({ page }) => {
        await setBodyContent(
            page,
            `
        <rux-pop-up id="popup-1" open>
        <rux-menu-item>Item 1</rux-menu-item>
        <rux-menu-item-divider></rux-menu-item-divider>
        <rux-menu-item value="2"
            >Item 2 with an exceedingly long title that overruns
            the width</rux-menu-item
        >
        <rux-menu-item disabled
            >Item 3 is disabled</rux-menu-item
        >
        <rux-menu-item value="Item 4"
            >Item 4 has a string value</rux-menu-item
        >
        <rux-menu-item href="https://www.astrouxds.com"
            >Item 5 is an anchor</rux-menu-item
        >
    </rux-pop-up>
        `
        )
        const el = page.locator('rux-pop-up')
        await expect(el).toHaveClass('hydrated')
    })
    test('it emits ruxpopupopened event', async ({ page }) => {
        await setBodyContent(
            page,
            `    
        <rux-pop-up placement="top-start" id="top">
        <rux-button slot="trigger" id="toggle-btn">Top</rux-button>
        <rux-menu>
            <rux-menu-item value="1" selected>Pop up menu option test</rux-menu-item>
            <rux-menu-item-divider></rux-menu-item-divider>
            <rux-menu-item value="2">Pop up menu option test</rux-menu-item>
            <rux-menu-item value="3">Pop up menu option test</rux-menu-item>
        </rux-menu>
    </rux-pop-up>`
        )
        page.addScriptTag({
            content: `
        document.addEventListener('ruxpopupopened', () => {
            console.log('opened');
        })
        document.addEventListener('ruxpopupclosed', () => {
            console.log('closed');
        })`,
        })
        const toggleBtn = page.locator('#toggle-btn')
        page.on('console', (msg) => {
            expect(msg.text()).toBe('opened')
        })
        await Promise.all([
            page.waitForEvent('console', { timeout: 5000 }),
            toggleBtn.click(),
        ])
    })
    test('it emits ruxpopupclosed event', async ({ page }) => {
        await setBodyContent(
            page,
            `    
        <rux-pop-up placement="top-start" id="top" open>
        <rux-button slot="trigger" id="toggle-btn">Top</rux-button>
        <rux-menu>
            <rux-menu-item value="1" selected>Pop up menu option test</rux-menu-item>
            <rux-menu-item-divider></rux-menu-item-divider>
            <rux-menu-item value="2">Pop up menu option test</rux-menu-item>
            <rux-menu-item value="3">Pop up menu option test</rux-menu-item>
        </rux-menu>
        </rux-pop-up>`
        )
        page.addScriptTag({
            content: `
        document.addEventListener('ruxpopupopened', () => {
            console.log('opened');
        })
        document.addEventListener('ruxpopupclosed', () => {
            console.log('closed');
        })`,
        })
        const toggleBtn = page.locator('#toggle-btn')
        page.on('console', (msg) => {
            expect(msg.text()).toBe('closed')
        })
        await Promise.all([
            page.waitForEvent('console', { timeout: 5000 }),
            toggleBtn.click(),
        ])
    })
    test('it closes on selection when close-on-select is true', async ({
        page,
    }) => {
        await setBodyContent(
            page,
            `
            <rux-pop-up close-on-select open>
                <rux-icon icon="apps" slot="trigger"></rux-icon>
                <rux-menu>
                    <rux-menu-item>Item 1</rux-menu-item>
                    <rux-menu-item>Item 2</rux-menu-item>
                </rux-menu>
            </rux-pop-up>
        `
        )
        const popup = page.locator('rux-pop-up')
        expect(popup).toHaveAttribute('open', '')
        const menuItem = page.locator('rux-menu-item').nth(0)
        await menuItem.click()
        await expect(popup).not.toHaveAttribute('open', '')
    })
})
