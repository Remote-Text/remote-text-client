import React from 'react'
import Home from '../../src/pages/index'

describe('<Home />', () => {
  it('render and displays expected content', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<Home />)
	
	cy.get('p').contains("Hello World! Press buttons to see API calls in console")

	  cy.get('[id=listFiles]').should('be.visible')
	  cy.get('[id=createFile]').should('be.visible')
	  cy.get('[id=saveFile]').should('be.visible')
	  cy.get('[id=getPreview]').should('be.visible')
	  cy.get('[id=getFile]').should('be.visible')
	  cy.get('[id=getHistory]').should('be.visible')
	  cy.get('[id=historyPageLink]').should('be.visible')
  })
})
