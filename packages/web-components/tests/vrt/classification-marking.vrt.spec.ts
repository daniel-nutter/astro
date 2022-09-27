import { test, expect } from '@playwright/test'
import { startTestEnv, setBodyContent } from '../utils/_startTestEnv'

test.describe('Classification Markings', () => {
    startTestEnv()

    test('classification marking', async ({ page }) => {
        await setBodyContent(
            page,
            `
			<div style="display: flex; flex-flow: column; justify-content: center; margin:20px;">
    <div style="position: relative; height: 40px; margin-bottom: 20px; overflow: hidden;">
        <rux-classification-marking classification="top-secret-sci"></rux-classification-marking>
    </div>
    <div style="position: relative; height: 40px; margin-bottom: 20px; overflow: hidden;">
        <rux-classification-marking classification="top-secret"></rux-classification-marking>
    </div>
    <div style="position: relative; height: 40px; margin-bottom: 20px; overflow: hidden;">
        <rux-classification-marking classification="secret"></rux-classification-marking>
    </div>
    <div style="position: relative; height: 40px; margin-bottom: 20px; overflow: hidden;">
        <rux-classification-marking classification="confidential"></rux-classification-marking>
    </div>
    <div style="position: relative; height: 40px; margin-bottom: 20px; overflow: hidden;">
        <rux-classification-marking classification="controlled"></rux-classification-marking>
    </div>
    <div style="position: relative; height: 40px; margin-bottom: 20px; overflow: hidden;">
        <rux-classification-marking classification="cui"></rux-classification-marking>
    </div>
    <div style="position: relative; height: 40px; margin-bottom: 20px; overflow: hidden;">
        <rux-classification-marking classification="unclassified"></rux-classification-marking>
    </div>
</div>
			`
        )
        await expect(page).toHaveScreenshot()
    })

    test('classification marking tags', async ({ page }) => {
        await setBodyContent(
            page,
            `
			<div style="display: flex; flex-flow: column; justify-content: flex-start; width: 400px; margin:60px auto;">
			<div style="display: flex; align-items:baseline; position: relative; height: 40px; margin-bottom: 20px; overflow: hidden;">
				<p style="display:flex; width:225px; font-size:14px; font-style:italic; color:#d5d7d9; margin: 0 0 1rem 0;">
					Top Secret//SCI
				</p>
				<rux-classification-marking tag="" classification="top-secret-sci"></rux-classification-marking>
			</div>
			<div style="display: flex; align-items:baseline; position: relative; height: 40px; margin-bottom: 20px; overflow: hidden;">
				<p style="display:flex; width:225px; font-size:14px; font-style:italic; color:#d5d7d9; margin: 0 0 1rem 0;">
					Top Secret
				</p>
				<rux-classification-marking tag="" classification="top-secret"></rux-classification-marking>
			</div>
			<div style="display: flex; align-items:baseline;  position: relative; height: 40px; margin-bottom: 20px; overflow: hidden;">
				<p style="display:flex; width:225px; font-size:14px; font-style:italic; color:#d5d7d9; margin: 0 0 1rem 0;">
					Secret
				</p>
				<rux-classification-marking tag="" classification="secret"></rux-classification-marking>
			</div>
			<div style="display: flex; align-items:baseline; position: relative; height: 40px; margin-bottom: 20px; overflow: hidden;">
				<p style="display:flex; width:225px; font-size:14px; font-style:italic; color:#d5d7d9; margin: 0 0 1rem 0;">
					Confidential
				</p>
				<rux-classification-marking tag="" classification="confidential"></rux-classification-marking>
			</div>
			<div style="display: flex; align-items:baseline; position: relative; height: 40px; margin-bottom: 20px; overflow: hidden;">
				<p style="display:flex; width:225px; font-size:14px; font-style:italic; color:#d5d7d9; margin: 0 0 1rem 0;">
					Controlled Unclassified
				</p>
				<rux-classification-marking tag="" classification="controlled"></rux-classification-marking>
			</div>
			<div style="display: flex; align-items:baseline; position: relative; height: 40px; margin-bottom: 20px; overflow: hidden;">
				<p style="display:flex; width:225px; font-size:14px; font-style:italic; color:#d5d7d9; margin: 0 0 1rem 0;">
					CUI Unclassified
				</p>
				<rux-classification-marking tag="" classification="cui"></rux-classification-marking>
			</div>
			<div style="display: flex; align-items:baseline; position: relative; height: 40px; margin-bottom: 20px; overflow: hidden;">
				<p style="display: flex; width:225px; font-size:13px; font-style:italic; color:#d5d7d9; margin: 0 0 1rem 0;">
					Uncontrolled Unclassified
				</p>
				<rux-classification-marking tag="" classification="unclassified"></rux-classification-marking>
			</div>
		</div>
			`
        )
        await expect(page).toHaveScreenshot()
    })
})
