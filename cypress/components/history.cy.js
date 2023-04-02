import React from 'react'
import HistoryPage from '../../src/pages/history'

describe('<HistoryPage />', () => {
	it('render and displays expected content', () => {
		cy.intercept('**/api/getHistory', {fixture: 'exampleHistory'}).as('getHistory')
		cy.mount(<HistoryPage />)

		cy.get('[id=treeWrapper]').should('be.visible')
		cy.get('[id=treeWrapper]').within(() => {

			// see the root
			cy.get('*[class^="rd3t-node historyTree_node__root"]').should('be.visible')

			// see the branch
			cy.get('*[class^="rd3t-node historyTree_node__branch"]').scrollIntoView().should('be.visible')

			// should have two leaves, one off of root and the other off of branch
			cy.get('*[class^="rd3t-leaf-node historyTree_node__leaf"]').should('have.length', 2).should('be.visible')


		})
	})

	it('should log the hashes when you press the buttons', () => {
		cy.intercept('**/api/getHistory', {fixture: 'exampleHistory'}).as('getHistory')
		cy.mount(<HistoryPage />)

		cy.get('[id=treeWrapper]').should('be.visible')
		cy.get('[id=treeWrapper]').within(() => {

			// checking console logs suck
			// we can test this once something actually happens on button press
			cy.get('*[class^="rd3t-node historyTree_node__root"]').get('circle').should('be.visible')
			cy.get('*[class^="rd3t-node historyTree_node__branch"]').scrollIntoView().get('circle').should('be.visible')
			cy.get('*[class^="rd3t-leaf-node historyTree_node__leaf"]').should('have.length', 2).get('circle').should('be.visible')

		})
	})
})
