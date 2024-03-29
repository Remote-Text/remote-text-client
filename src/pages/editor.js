import styles from "../styles/Home.module.css"
import {Header} from '../components/Header';
import React, {useEffect, useState} from 'react'
import RemoteTextApi from '../externalApis/remoteTextApi.js'

const remoteTextApi = new RemoteTextApi()
const {convert} = require('html-to-text')

// for dealing with parameters
async function getQueryString() {
	let queryString = window.location.search
	let queryStringPromise = new Promise((resolve) => {
		if (queryString != undefined) {
			resolve(queryString)
		}
	})
	return queryStringPromise
}

// for dealing with API calls:
async function getFileData(id, hash) {

	let fileData = await remoteTextApi.getFile(id, hash)
	let filePromise = new Promise((resolve) => {
		if (fileData != undefined) {
			resolve(fileData)
		}
	})
	return filePromise
}

function htmlEscape(str) {
	return str
		.replaceAll(/&/g, '&amp;')
		.replaceAll(/"/g, '&quot;')
		.replaceAll(/'/g, '&#39;')
		.replaceAll(/</g, '&lt;')
		.replaceAll(/>/g, '&gt;')
		.replaceAll("\n", "<br>")
}

// this seems like a strange work-around to only loading correct content once, but I couldn't figure out a better alternative.
function setContent(content, flag) {

	if (content != undefined && !flag) {
		let contentHTML = htmlEscape(content)
		document.getElementById("editor").innerHTML = contentHTML
		return true
	} else {
		return false
	}
}

// saves new contents to some branch branch
async function saveFile(fileData, branchData, name) {
	let contentElement = document.getElementById("editor")
	let newContentStr = convert(contentElement.innerHTML, {wordwrap: null})
	const newFileObject = {
		name: fileData.name,
		id: fileData.id,
		content: newContentStr,
		parent: branchData.hash,
		branch: name
	}
	await remoteTextApi.saveFile(newFileObject)
		.then(saveResponse => {
			window.open(document.location.origin + "/editor?id=" + fileData.id + "&name=" + fileData.name + "&hash=" + saveResponse.hash + "&branch=" + name, "_self")  // reload to new save
		})
}

async function saveToBranch(fileData, branchData) {
	document.getElementById("createBranch").hidden = false
	await remoteTextApi.getHistory(fileData.id)
		.then(histData => {
			let branchView = document.getElementById("branchList")
			let branchList = ""
			histData.refs.forEach(b => {
				branchList += "<button id=" + b.hash + ">" + b.name + "</button>"
			})
			branchView.innerHTML = branchList
			histData.refs.forEach(b => {
				document.getElementById(b.hash).addEventListener("click", () => {saveFile(fileData, branchData, b.name)})
				document.getElementById(b.hash).className = styles.editorButtons
			})
		})
}

function saveNew(fileData, branchData, name) {
	if (name != "") {  // check if valid name (should we make these criteria more specific?)
		saveFile(fileData, branchData, name)
	} else {
		document.getElementById("invalidBranchName").hidden = false
	}
}

async function openPreview(fileData, branchData) {
	await remoteTextApi.previewFile(fileData.id, branchData.hash)
		.then(response => {
			console.log(response.log)
			if (response.state == "FAILURE") {
				document.getElementById("previewResponse").innerHTML = "Failed to compile preview :("
			} else if (response.state == "SUCCESS") {
				window.open(document.location.origin + "/preview?id=" + fileData.id + "&name=" + fileData.name + "&hash=" + branchData.hash + "&branch=" + branchData.name)
			}
		})
}

// main
export default function Editor() {

	const [fileData, setFileData] = useState({})
	const [branchData, setBranchData] = useState({})
	const [contentLoadedFlag, setContentLoadedFlag] = useState({})
	useEffect(() => {
		getQueryString()
			.then(data => {
				const urlParams = new URLSearchParams(data)
				const fileID = urlParams.get('id')
				const fileHash = urlParams.get('hash')
				const branchName = urlParams.get('branch')
				setBranchData({hash: fileHash, name: branchName})

				getFileData(fileID, fileHash)
					.then(data => {setFileData(data)}) // fileData contains name, id, & content.
				setContentLoadedFlag(false)
			})
	}, [])   // ^this runs only once on load

	setContent(fileData.content, contentLoadedFlag)


	return (
		<>
			<div className={styles.imageHeader}>
				<img src="/logo.png" alt="my_Logo"></img>
			</div>
			<Header helpText="Edit the file in the window below. To Save the File, click 'Save File' and follow the instructions. To preview the compiled version of the file, click 'Preview File'. " />
			<main className={styles.filesMain}>
				<h2>RemoteText Editor: {fileData.name}</h2>
				<div id="toolbar">
					<button className={styles.editorButtons} id="SaveFile" onClick={() => saveToBranch(fileData, branchData)}>Save File</button>
					<div class={styles.indented} id="createBranch" hidden={true}>
						<div className={styles.branchName}>
							<p>Click a branch name to save to that branch, or enter a new branch name</p>
							<div id="branchList"></div>
							<div className={styles.newBranchName}>
								<label htmlFor="branchName">New branch name:</label>
								<input type="text" id="branchName" name="branchName" required minLength="1" maxLength="64" size="10"></input>
								<button className={styles.editorButtons} id="saveToBranch" onClick={() => saveNew(fileData, branchData, document.getElementById("branchName").value)}>Save to new branch</button>
								<p id="invalidBranchName" hidden={true}>Not a valid branch name.</p>
							</div>
							<button onClick={() => document.getElementById("createBranch").hidden = true}>Cancel</button>
						</div>
					</div>
					<button className={styles.editorButtons} id="previewButton" onClick={() => openPreview(fileData, branchData)}>Preview File</button>
					<div id="previewResponse"></div>
				</div>

				<div id="editor" className={styles.editor} contentEditable="true"></div>
			</main>
		</>
	)

}
