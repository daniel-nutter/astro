import { test, expect } from '@playwright/test'
import { startTestEnv, setBodyContent } from '../utils/_startTestEnv'

test.describe('Card', () => {
    startTestEnv()

    test('card', async ({ page }) => {
        await setBodyContent(
            page,
            `
				<rux-card>Hello</rux-card>
			`
        )
        await expect(page).toHaveScreenshot()
    })

    test('card with header', async ({ page }) => {
        await setBodyContent(
            page,
            `
				<rux-card>
					<header slot="header">Title</header>
					Hello
				</rux-card>
			`
        )
        await expect(page).toHaveScreenshot()
    })

    test('card with footer', async ({ page }) => {
        await setBodyContent(
            page,
            `
				<rux-card>
					Hello
					<footer slot="footer">Footer</footer>
				</rux-card>
			`
        )
        await expect(page).toHaveScreenshot()
    })

    test('card without padding', async ({ page }) => {
        await setBodyContent(
            page,
            `
				<rux-card style="--body-padding: 0;">
					Hello
				</rux-card>
			`
        )
        await expect(page).toHaveScreenshot()
    })
})
