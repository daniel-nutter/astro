import { html, fixture, expect } from '@open-wc/testing'

// import '../web-components';
import { defineCustomElements } from '../loader'
defineCustomElements(window)

describe('<web-components>', () => {
    it('is rendered', async () => {
        const el = await fixture('<rux-button>hi</rux-button>')
        expect(el.getAttribute('class')).to.equal('hydrated')
    })
})
