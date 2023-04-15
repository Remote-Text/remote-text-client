
describe('SaveAndEditFile', () => {

	var fileId;

	// you must have the server set up and running for this test to succeed
	it('We are able to create a file', () => {

		cy.visit({
			url: 'http://localhost:3000/files',
			method: 'GET',
		})

		cy.window().then((win) => {
			fileId = cy.stub(win, 'open').as('windowOpen').args
		})
		// make sure the button is there
		let createFileButton = cy.get('[id=createFileButton]')
		createFileButton.should('be.visible')

		//press it
		createFileButton.click()

		// A window to put a file name should show up
		let fileNameInputForm = cy.get("[id=fileName]")
		fileNameInputForm.should('be.visible')

		// just in case you want to run this multiple times in a row
		const d = new Date()
		let somewhatRandomString = "foo" + d.getMilliseconds().toString() + ".txt"

		// enter file name
		fileNameInputForm.type(somewhatRandomString)


		// create that file
		let createFileWithGivenName = cy.get("[id=createFileWithGivenName]")
		createFileWithGivenName.should('be.visible')
		createFileWithGivenName.click()

		//should open a new window
		cy.window().its('open').should("be.called")
	})



	it('able to see the history of the file', () => {
		// should be an id
		fileId = fileId[0][0].split("id=")[1]
		console.log(fileId.length)
		assert(fileId.length == 36)
		cy.visit({
			url: 'http://localhost:3000/history',
			method: 'GET',
			qs: {
				id: fileId
			}

		})

		cy.get('[id=treeWrapper]').should('be.visible')
		cy.get('[id=treeWrapper]').within(() => {

			// checking console logs suck
			// we can test this once something actually happens on button press
			let fileNode = cy.get('*[class^="rd3t-leaf-node historyTree_node__root"]').get('circle')
			fileNode.should("be.visible")
			fileNode.click()

		})
	})

})
