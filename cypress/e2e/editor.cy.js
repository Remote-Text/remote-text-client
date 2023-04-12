
describe('History', () => {
	it('render and displays expected content', () => {
		cy.intercept('**/api/getFile', {fixture: 'exampleFile'}).as('getFile')
		cy.visit({
			url: 'http://localhost:3000/editor',
			method: 'GET',
			qs: {
				id: '1'.repeat(32)
			}

		})
		cy.get('[id=editor]').should('be.visible')
		cy.get('[id=editor]').contains("Example Content")
	})


})
