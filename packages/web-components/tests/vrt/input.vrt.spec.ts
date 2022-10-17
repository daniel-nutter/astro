import { test, expect } from '@playwright/test'
import { startTestEnv, setBodyContent } from '../utils/_startTestEnv'
import { findCombos } from '../utils/findCombos'

test.describe('Input', () => {
    startTestEnv()

    const sizes = ['small', 'medium', 'large']
    const states = ['default', 'hover', 'disabled']
    const types = [
        'date',
        'datetime-local',
        'email',
        'number',
        'password',
        'search',
        'tel',
    ]

    const arr2d = [
        ['small', 'medium', 'large'],
        ['default', 'hover'],
        ['primary', 'secondary', 'borderless'],
        [true, false],
    ]

    // const sizeCombos = findCombos(sizes)

    // const combinations = findCombos(arr2d)

    sizes.forEach((size: string) => {
        test(`Size=${size}`, async ({ page }) => {
            await setBodyContent(
                page,
                `
				                    <rux-input 
				                        size="${size}"
										type="text
				                    >Hello</rux-input>
				                `
            )
            await expect(page).toHaveScreenshot()
        })
    })

    types.forEach((types: string) => {
        test(`Types=${types}`, async ({ page }) => {
            await setBodyContent(
                page,
                `<rux-input type="${types}" type="text></rux-input>`
            )
            await expect(page).toHaveScreenshot()
        })
    })

    test(`State=hover`, async ({ page }) => {
        await setBodyContent(page, `<rux-input type="text></rux-input>`)
        const el = await page.locator('rux-input')
        await el.hover({ force: true })
        await expect(page).toHaveScreenshot()
    })

    test(`State=disabled`, async ({ page }) => {
        await setBodyContent(
            page,
            `<rux-input disabled type="text></rux-input>`
        )
        await expect(page).toHaveScreenshot()
    })

    test(`State=invalid`, async ({ page }) => {
        await setBodyContent(page, `<rux-input invalid type="text></rux-input>`)
        await expect(page).toHaveScreenshot()
    })

    test(`With Label`, async ({ page }) => {
        await setBodyContent(
            page,
            `<rux-input label="Name" type="text></rux-input>`
        )
        await expect(page).toHaveScreenshot()
    })

    test(`With Help Text`, async ({ page }) => {
        await setBodyContent(
            page,
            `<rux-input help-text="Help Text" type="text></rux-input>`
        )
        await expect(page).toHaveScreenshot()
    })

    test(`With Error Text`, async ({ page }) => {
        await setBodyContent(
            page,
            `<rux-input error-text="Error Text" type="text></rux-input>`
        )
        await expect(page).toHaveScreenshot()
    })

    test(`Required`, async ({ page }) => {
        await setBodyContent(
            page,
            `<rux-input required type="text></rux-input>`
        )
        await expect(page).toHaveScreenshot()
    })

    test(`Slots`, async ({ page }) => {
        await setBodyContent(
            page,
            `<rux-input type="text>
				<rux-icon slot="prefix" icon="border-clear" size="extra-small"></rux-icon>
				<rux-icon slot="suffix" icon="border-clear" size="extra-small"></rux-icon>
			</rux-input>`
        )
        await expect(page).toHaveScreenshot()
    })
    // combinations.forEach((testCase: any) => {
    //     const size = testCase[0]
    //     const state = testCase[1]
    //     const variant = testCase[2]
    //     const disabled = testCase[3]

    //     test(`test size=${size} state=${state} variant=${variant} disabled=${disabled}`, async ({
    //         page,
    //     }) => {
    //         await setBodyContent(
    //             page,
    //             `
    //                     <rux-button
    //                         size="${size}"
    //                         ${variant === 'secondary' ? 'secondary' : null}
    //                         ${variant === 'borderless' ? 'borderless' : null}
    //                         ${disabled === true ? 'disabled' : null}
    //                     >Hello</rux-button>
    //                 `
    //         )

    //         if (state === 'hover') {
    //             const el = page.locator('rux-button')
    //             await el.hover({ force: true })
    //         }
    //         await expect(page).toHaveScreenshot()
    //     })
    // })
})
