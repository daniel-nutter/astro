import { test, expect } from '@playwright/test'
import { startTestEnv, setBodyContent } from '../utils/_startTestEnv'
import { findCombos } from '../utils/findCombos'

test.describe('Button', () => {
    startTestEnv()

    // test('size - large', async ({ page }) => {
    //     await setBodyContent(
    //         page,
    //         `
    // 			<rux-button size="large">Hello</rux-button>
    // 		`
    //     )
    // 	await expect(page).toHaveScreenshot()
    // })
    // test('size - medium', async ({ page }) => {
    //     await setBodyContent(
    //         page,
    //         `
    // 			<rux-button size="medium">Hello</rux-button>
    // 		`
    //     )
    // 	await expect(page).toHaveScreenshot()
    // })
    // test('size - small', async ({ page }) => {
    //     await setBodyContent(
    //         page,
    //         `
    // 			<rux-button size="small">Hello</rux-button>
    // 		`
    //     )
    // 	await expect(page).toHaveScreenshot()
    // })
    // test('disabled', async ({ page }) => {
    //     await setBodyContent(
    //         page,
    //         `
    // 			<rux-button disabled>Hello</rux-button>
    // 		`
    //     )
    // 	await expect(page).toHaveScreenshot()
    // })
    // test('primary medium hover', async ({ page }) => {
    //     await setBodyContent(
    //         page,
    //         `
    // 			<rux-button size="medium">Hello</rux-button>
    // 		`
    //     )
    // 	const el = page.locator('rux-button')
    // 	await el.hover()
    // 	await expect(page).toHaveScreenshot()
    // })

    // test('hover disabled', async ({ page }) => {
    //     await setBodyContent(
    //         page,
    //         `
    // 			<rux-button disabled>Hello</rux-button>
    // 		`
    //     )
    // 	const el = page.locator('rux-button')
    // 	await el.hover()
    // 	await expect(page).toHaveScreenshot()
    // })

    // test('secondary', async ({ page }) => {
    //     await setBodyContent(
    //         page,
    //         `
    // 			<rux-button secondary>Hello</rux-button>
    // 		`
    //     )
    // 	await expect(page).toHaveScreenshot()
    // })

    // test('secondary disabled', async ({ page }) => {
    //     await setBodyContent(
    //         page,
    //         `
    // 			<rux-button disabled secondary>Hello</rux-button>
    // 		`
    //     )
    // 	await expect(page).toHaveScreenshot()
    // })

    // test('secondary hover', async ({ page }) => {
    //     await setBodyContent(
    //         page,
    //         `
    // 			<rux-button secondary>Hello</rux-button>
    // 		`
    //     )
    // 	const el = page.locator('rux-button')
    // 	await el.hover()
    // 	await expect(page).toHaveScreenshot()
    // })

    // test('secondary hover disabled', async ({ page }) => {
    //     await setBodyContent(
    //         page,
    //         `
    // 			<rux-button disabled secondary>Hello</rux-button>
    // 		`
    //     )
    // 	const el = page.locator('rux-button')
    // 	await el.hover()
    // 	await expect(page).toHaveScreenshot()
    // })

    // Given this:
    // Size = [Small, Medium, Large]
    // State = [Default, Hover]
    // Variant = [Primary, Secondary, Borderless]
    // IconOnly = [True, False]

    // Output something like:
    // Size=Small State=Default Disabled=False Variant=Primary IconOnly=False
    // Size=Small State=Default Disabled=True Variant=Primary IconOnly=False
    // Size=Small State=Hover Disabled=False Variant=Primary IconOnly=False
    // Size=Small State=Hover Disabled=True Variant=Primary IconOnly=False

    // Size: Medium State: Default Disabled: False
    // Size: Large State: Default Disabled: False

    const arr2d = [
        ['small', 'medium', 'large'],
        ['default', 'hover'],
        ['primary', 'secondary', 'borderless'],
        [true, false],
    ]

    const combinations = findCombos(arr2d)

    combinations.forEach((testCase: any) => {
        const size = testCase[0]
        const state = testCase[1]
        const variant = testCase[2]
        const disabled = testCase[3]

        test(`test size=${size} state=${state} variant=${variant} disabled=${disabled}`, async ({
            page,
        }) => {
            await setBodyContent(
                page,
                `
                        <rux-button 
                            size="${size}"
                            ${variant === 'secondary' ? 'secondary' : null}
                            ${variant === 'borderless' ? 'borderless' : null}
                            ${disabled === true ? 'disabled' : null}
                        >Hello</rux-button>
                    `
            )

            if (state === 'hover') {
                const el = page.locator('rux-button')
                await el.hover({ force: true })
            }
            await expect(page).toHaveScreenshot()
        })
    })
})
