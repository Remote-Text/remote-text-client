import Editor from '../../src/pages/editor'

describe('<Editor />', () => {
	// the case where there is file contents needs to be an e2e test
	// cypress won't let us mock the query string in the url in a component test 
	it('render and displays expected content with no file', () => {
		cy.mount(<Editor />)

		cy.get('[id=SaveFile]').should('be.visible')
	})
})
