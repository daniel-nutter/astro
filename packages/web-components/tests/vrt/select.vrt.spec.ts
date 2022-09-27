import { test, expect } from '@playwright/test'
import { startTestEnv, setBodyContent } from '../utils/_startTestEnv'

test.describe('Select', () => {
    startTestEnv()

    test('select', async ({ page }) => {
        await setBodyContent(
            page,
            `
			<rux-select label="Select Menu" input-id="1" label-id="1" name="default" size="medium">
				<rux-option value="" selected="" label="Select an option"></rux-option>
				<rux-option value="1.1" label="Option 1.1"></rux-option>
				<rux-option value="1.2" label="Option 1.2"></rux-option>
				<rux-option value="1.3" label="Option 1.3"></rux-option>
				<rux-option value="1.4" disabled="" label="Option 1.4 (disabled)"></rux-option>
			</rux-select>
			`
        )
        await expect(page).toHaveScreenshot()
    })

    test('select - hover', async ({ page }) => {
        await setBodyContent(
            page,
            `
			<rux-select label="Select Menu" input-id="1" label-id="1" name="default" size="medium">
				<rux-option value="" selected="" label="Select an option"></rux-option>
				<rux-option value="1.1" label="Option 1.1"></rux-option>
				<rux-option value="1.2" label="Option 1.2"></rux-option>
				<rux-option value="1.3" label="Option 1.3"></rux-option>
				<rux-option value="1.4" disabled="" label="Option 1.4 (disabled)"></rux-option>
			</rux-select>
			`
        )

        const el = await page.locator('rux-select')
        await el.hover()
        await expect(page).toHaveScreenshot()
    })

    test('select - disabled', async ({ page }) => {
        await setBodyContent(
            page,
            `
			<rux-select label="Select Menu" disabled input-id="1" label-id="1" name="default" size="medium">
				<rux-option value="" selected="" label="Select an option"></rux-option>
				<rux-option value="1.1" label="Option 1.1"></rux-option>
				<rux-option value="1.2" label="Option 1.2"></rux-option>
				<rux-option value="1.3" label="Option 1.3"></rux-option>
				<rux-option value="1.4" disabled="" label="Option 1.4 (disabled)"></rux-option>
			</rux-select>
			`
        )

        await expect(page).toHaveScreenshot()
    })

    test('select - disabled - hover', async ({ page }) => {
        await setBodyContent(
            page,
            `
			<rux-select label="Select Menu" disabled input-id="1" label-id="1" name="default" size="medium">
				<rux-option value="" selected="" label="Select an option"></rux-option>
				<rux-option value="1.1" label="Option 1.1"></rux-option>
				<rux-option value="1.2" label="Option 1.2"></rux-option>
				<rux-option value="1.3" label="Option 1.3"></rux-option>
				<rux-option value="1.4" disabled="" label="Option 1.4 (disabled)"></rux-option>
			</rux-select>
			`
        )

        const el = await page.locator('rux-select')
        await el.hover()
        await expect(page).toHaveScreenshot()
    })
})
