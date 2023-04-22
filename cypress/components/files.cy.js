import Files from '../../src/pages/files'

describe('<Files />', () => {
	it('is empty when no files', () => {
		cy.intercept('**/api/listFiles', []).as('listFiles')
		cy.mount(<Files />)

		cy.get('[id=fileTable]').should('be.visible')
		cy.get('[id=fileTable]').contains("You do not appear to have any files")

	})

	it('shows files when some are returned', () => {

		// if we make the api return two files, those files should be displayed
		cy.intercept('**/api/listFiles', {fixture: 'exampleFiles'}).as('listFiles')
		cy.mount(<Files />)

		cy.get('[id=fileTable]').should('be.visible')
		cy.get('[id=fileTable]').within(() => {

			let firstFile = cy.get(`*[id="${"0".repeat(32)}"]`)
			firstFile.should('be.visible')
			firstFile.find('[id=name]').contains("foo1.txt")

			let secondFile = cy.get(`*[id="${"1" + "0".repeat(31)}"]`)
			secondFile.should('be.visible')
			secondFile.find('[id=name]').contains("foo2.txt")


		})

	})
})
