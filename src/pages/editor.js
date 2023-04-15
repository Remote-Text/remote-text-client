import styles from './index.js'
import Head from "next/head"
import React, {useEffect, useState} from 'react'
import RemoteTextApi from '../externalApis/remoteTextApi.js'
//var error_throw = "                __ \n               / _) \n      _.----._/ / \n     /   error / \n  __/ (  | (  | \n /__.-'|_|--|_|"

const remoteTextApi = new RemoteTextApi();

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
	/*    let fileData = {        // Dummy data
			name: "foo.txt",
			id: "aec23664ae26d76ab66cedfb1206b9c9",
			content: "hello world! is this working? I think it is",
		}*/
	let fileData = await remoteTextApi.getFile(id, hash)
	let filePromise = new Promise((resolve) => {
		if (fileData != undefined) {
			resolve(fileData)
		}
	})
	return filePromise
}

// this seems like a strange work-around to only loading correct content once, but I couldn't figure out a better alternative.
function setContent(content, flag) {
	if (content != undefined && !flag) {
		document.getElementById("editor").innerHTML = content
		return true
	} else {
		return false
	}
}

// saves new contents to some branch branch
async function saveFile(fileObject, hash) {
	let newContent = document.getElementById("editor").innerHTML
	let newBranchName = document.getElementById("branchName").value
	const newFileObject = {
		name: fileObject.name,
		id: fileObject.id,
		content: newContent,
		parent: hash,  // does parent also change when branch changes?
		branch: newBranchName
	}
	await remoteTextApi.saveFile(newFileObject)
		.then(saveResponse => {
			console.log("File saved to branch '" + newBranchName + "'. API response:", saveResponse)  // unsure what we're supposed to do with this info (hash & parent)
			hideSaveFile()
		})
}

// show hidden html elements for saveAs
function showSaveFile() {
	document.getElementById("saveAs").hidden = false
}

function hideSaveFile() {
	document.getElementById("saveAs").hidden = true
}

// main
export default function Editor() {
	const [fileData, setFileData] = useState({})
	const [currentHash, setCurrentHash] = useState({})
	const [contentLoadedFlag, setContentLoadedFlag] = useState({})
	useEffect(() => {
		getQueryString()
			.then(data => {
				const urlParams = new URLSearchParams(data)
				const fileID = urlParams.get('id')
				const fileHash = urlParams.get('hash')
				setCurrentHash(fileHash)

				getFileData(fileID, fileHash)
					.then(data => {setFileData(data)}) // fileData currently contains name, id, & content. Would like to have it also include the branch & parent of the file, to use as default params for saveFile.
				setContentLoadedFlag(false)
			})
	}, [])   // ^this runs only once on load

	setContent(fileData.content, contentLoadedFlag)

	return (
		<>
			<Head>
				<title>{fileData.name}</title>
			</Head>
			<main className={styles.main}>
				<div className="editor" contentEditable="true" id="editor"></div>
				<button id="SaveFile" onClick={showSaveFile}>Save File</button>
				<div id="saveAs" hidden={true}>
					<label htmlFor="branchName">Name of branch to save to:</label>
					<input type="text" id="branchName" name="branchName" required minLength="1" maxLength="64" size="10"></input>
					<button id="saveToBranch" onClick={() => saveFile(fileData, currentHash)}>Save to Branch</button>
				</div>
			</main>
		</>
	)
}
