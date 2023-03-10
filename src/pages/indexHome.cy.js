import React from 'react'
import Home from './index'

describe('<Home />', () => {
  it('render and displays expected content', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<Home />)
	
	cy.get('p').contains("HELLO WORLD")
	
	cy.get('button').should('be.visible')
  })
})
