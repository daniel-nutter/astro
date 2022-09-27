import { test, expect } from '@playwright/test'
import { setBodyContent } from '../utils/_startTestEnv'

test.describe('Clock', () => {
    test.beforeEach(async ({ page }) => {
        const fakeNow = new Date('March 14 2042 13:37:11').valueOf()

        // Mock Date
        await page.addInitScript(`{
			// Extend Date constructor to default to fakeNow
			Date = class extends Date {
				constructor(...args) {
				if (args.length === 0) {
					super(${fakeNow});
				} else {
					super(...args);
				}
				}
			}
			// Override Date.now() to start from fakeNow
			const __DateNowOffset = ${fakeNow} - Date.now();
			const __DateNow = Date.now;
			Date.now = () => __DateNow() + __DateNowOffset;
		}`)

        await page.goto('http://localhost:3333')
    })

    test('clock', async ({ page }) => {
        await setBodyContent(
            page,
            `
				<rux-clock></rux-clock>
			`
        )

        await expect(page).toHaveScreenshot()
    })

    test('small clock', async ({ page }) => {
        await setBodyContent(
            page,
            `
				<rux-clock small></rux-clock>
			`
        )

        await expect(page).toHaveScreenshot()
    })
})
