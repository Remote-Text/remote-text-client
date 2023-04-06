import React from 'react'
import Home from '../../src/pages/text_editor'

describe('<Home />', () => {
    it('render and displays expected content', () => {
        // see: https://on.cypress.io/mounting-react
        cy.mount(<Home />)

        cy.get('[id=saveFile]').should('be.visible')
        cy.get('[id=setContents]').should('be.visible')

    })
})