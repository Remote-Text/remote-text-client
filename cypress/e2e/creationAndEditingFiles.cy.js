
describe('creationAndEditing', () => {

	var fileId;
	let inputString = "Here is a dummy input string."

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



	it('able to see the history of the file edit the file, and save the file', () => {
		// should be an id
		fileId = fileId[0][0].split("id=")[1]
		assert(fileId.length == 36)
		cy.visit({
			url: 'http://localhost:3000/history',
			method: 'GET',
			qs: {
				id: fileId
			}

		})

		cy.get('[id=treeWrapper]').should('be.visible')

		cy.wait(1000)
		// checking console logs suck
		// we can test this once something actually happens on button press
		let fileNode = cy.get('*[class^="rd3t-leaf-node historyTree_node__root"]').get('circle')
		fileNode.should("be.visible")
		fileNode.click()

		// make sure we have switched to editor
		cy.url().should('include', 'editor')

		// A window to put a file name should show up
		let editorInput = cy.get("[id=editor]")
		editorInput.should('be.visible')

		// write some text
		editorInput.type(inputString)

		let saveFile = cy.get("[id=SaveFile]")
		saveFile.should('be.visible')
		cy.wait(1000)
		saveFile.click()


		let branchNameForm = cy.get("[id=branchName]")
		branchNameForm.should('be.visible')
		branchNameForm.type("main")
		cy.wait(1000)


		// save to branch
		let saveToBranchButton = cy.get("[id=saveToBranch]")
		saveToBranchButton.should('be.visible')
		saveToBranchButton.click()

		cy.wait(1000)

		// visit the history page
		cy.visit({
			url: 'http://localhost:3000/history',
			method: 'GET',
			qs: {
				id: fileId
			}

		})

		cy.wait(1000)
		// make sure the file history has been updated

		cy.get('[id=treeWrapper]').should('be.visible')
		cy.get('[id=treeWrapper]').within(() => {

			// see the root
			cy.get('*[class^="rd3t-node historyTree_node__root"]').should('be.visible')

			// should have one leaf
			cy.get('*[class^="rd3t-leaf-node historyTree_node__leaf"]').should('have.length', 1).should('be.visible')


		})
	})



	it('save to another branch on the same file', () => {
		// should be an id
		assert(fileId.length == 36)
		cy.visit({
			url: 'http://localhost:3000/history',
			method: 'GET',
			qs: {
				id: fileId
			}

		})

		cy.get('[id=treeWrapper]').should('be.visible')

		cy.wait(1000)
		let fileNode = cy.get('*[class^="rd3t-node historyTree_node__root"]').get('circle').first()
		fileNode.should("be.visible")
		fileNode.click({multiple: true})

		// make sure we have switched to editor
		cy.url().should('include', 'editor')

		// A window to put a file name should show up
		let editorInput = cy.get("[id=editor]")
		editorInput.should('be.visible')

		// write some text
		editorInput.type(inputString)

		let saveFile = cy.get("[id=SaveFile]")
		saveFile.should('be.visible')
		cy.wait(1000)
		saveFile.click()


		let branchNameForm = cy.get("[id=branchName]")
		branchNameForm.should('be.visible')
		branchNameForm.type("new_branch")
		cy.wait(1000)


		// save to branch
		let saveToBranchButton = cy.get("[id=saveToBranch]")
		saveToBranchButton.should('be.visible')
		saveToBranchButton.click()

		cy.wait(1000)

		// visit the history page
		cy.visit({
			url: 'http://localhost:3000/history',
			method: 'GET',
			qs: {
				id: fileId
			}

		})

		cy.wait(1000)
		// make sure the file history has been updated

		cy.get('[id=treeWrapper]').should('be.visible')
		cy.get('[id=treeWrapper]').within(() => {

			// see the root
			cy.get('*[class^="rd3t-node historyTree_node__root"]').should('be.visible')

			// should have one leaf
			cy.get('*[class^="rd3t-leaf-node historyTree_node__leaf"]').should('have.length', 2).should('be.visible')


		})
	})

})
