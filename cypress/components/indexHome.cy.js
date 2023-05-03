import React from 'react'
import Home from '../../src/pages/index'

describe('<Home />', () => {
	it('render and displays expected content', () => {
		// see: https://on.cypress.io/mounting-react
		cy.mount(<Home />)

		cy.get('p').contains("Welcome to RemoteText")

	})
})
