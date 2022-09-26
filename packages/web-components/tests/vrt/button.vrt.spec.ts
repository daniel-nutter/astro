import { test, expect } from '@playwright/test'
import { startTestEnv, setBodyContent } from '../utils/_startTestEnv'

test.describe('Button', () => {
    startTestEnv()

    test('size - large', async ({ page }) => {
        await setBodyContent(
            page,
            `
				<rux-button size="large">Hello</rux-button>
			`
        )
		await expect(page).toHaveScreenshot()
    })
	test('size - medium', async ({ page }) => {
        await setBodyContent(
            page,
            `
				<rux-button size="medium">Hello</rux-button>
			`
        )
		await expect(page).toHaveScreenshot()
    })
	test('size - small', async ({ page }) => {
        await setBodyContent(
            page,
            `
				<rux-button size="small">Hello</rux-button>
			`
        )
		await expect(page).toHaveScreenshot()
    })
	test('disabled', async ({ page }) => {
        await setBodyContent(
            page,
            `
				<rux-button disabled>Hello</rux-button>
			`
        )
		await expect(page).toHaveScreenshot()
    })
	test('primary medium hover', async ({ page }) => {
        await setBodyContent(
            page,
            `
				<rux-button size="medium">Hello</rux-button>
			`
        )
		const el = page.locator('rux-button')
		await el.hover()
		await expect(page).toHaveScreenshot()
    })

	test('hover disabled', async ({ page }) => {
        await setBodyContent(
            page,
            `
				<rux-button disabled>Hello</rux-button>
			`
        )
		const el = page.locator('rux-button')
		await el.hover()
		await expect(page).toHaveScreenshot()
    })

	test('secondary', async ({ page }) => {
        await setBodyContent(
            page,
            `
				<rux-button secondary>Hello</rux-button>
			`
        )
		await expect(page).toHaveScreenshot()
    })

	test('secondary disabled', async ({ page }) => {
        await setBodyContent(
            page,
            `
				<rux-button disabled secondary>Hello</rux-button>
			`
        )
		await expect(page).toHaveScreenshot()
    })

	test('secondary hover', async ({ page }) => {
        await setBodyContent(
            page,
            `
				<rux-button secondary>Hello</rux-button>
			`
        )
		const el = page.locator('rux-button')
		await el.hover()
		await expect(page).toHaveScreenshot()
    })

	test('secondary hover disabled', async ({ page }) => {
        await setBodyContent(
            page,
            `
				<rux-button disabled secondary>Hello</rux-button>
			`
        )
		const el = page.locator('rux-button')
		await el.hover()
		await expect(page).toHaveScreenshot()
    })

})
