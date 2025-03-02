import { test, expect } from '@playwright/test'
import { startTestEnv, setBodyContent } from './utils/_startTestEnv'

test.describe('Classification marking banners', () => {
    startTestEnv()

    test('it renders', async ({ page }) => {
        await setBodyContent(
            page,
            `<rux-classification-marking></rux-classification-marking>`
        )

        const el = page.locator('rux-classification-marking')
        await expect(el).toBeVisible()
        await expect(el).toHaveClass('hydrated')
    })
    test('it sets attributes', async ({ page }) => {
        await setBodyContent(
            page,
            `
        <rux-classification-marking classification="secret" label="Label"></rux-classification-marking>
    `
        )

        const el = page.locator('rux-classification-marking')
        await expect(el).toHaveAttribute('classification', 'secret')
        await expect(el).toHaveAttribute('label', 'Label')
    })
    //? This is a nice to have test - but the current functionlaity just renders a green bar with no label.
    // test('it renders the correct default of unclassified if incorrect classification is provided', async ({
    //     page,
    // }) => {
    //             await setBodyContent(
    // page, `
    //     <rux-classification-marking classification="not real"></rux-classification-marking>
    // `)

    //     const el = page.locator('rux-classification-marking')
    //     await expect(el).toHaveAttribute('classification', 'unclassified')
    // })
    test('it renders a footer banner when supplied', async ({ page }) => {
        await setBodyContent(
            page,
            `
        <rux-classification-marking classification="secret">
            <h1>Test title for footer banner</h1>
        </rux-classification-marking>
        `
        )

        const topBanner = page.locator('.rux-classification--banner').first()
        const footerBanner = page.locator('.rux-classification--banner__footer')
        expect(topBanner).toBeDefined()
        expect(footerBanner).toBeDefined()
        await expect(topBanner).toBeVisible()
        await expect(footerBanner).toBeVisible()
    })
})
