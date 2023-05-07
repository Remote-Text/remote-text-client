import Head from "next/head"
import {Header} from '../components/Header';
import styles from "../styles/Home.module.css"
import RemoteTextApi from "../externalApis/remoteTextApi.js"
import React, {useEffect, useState} from "react"
import {saveAs} from 'file-saver'

const remoteTextApi = new RemoteTextApi()

function openFile(id, fileName) {
	window.open(document.location.origin + "/history?id=" + id + "&name=" + fileName)
}

// dealing with API call listFiles promise
async function listFilesData() {
	let fileData = remoteTextApi.listFiles()
	let filePromise = new Promise((resolve) => {
		if (fileData != undefined) {
			resolve(fileData)
		}
	})
	return filePromise
}

// read data from createFile API call and open new file

async function createNewFile(name, fileContent = "") {
	await remoteTextApi.createFile(name, fileContent)
		.then(fileData => {
			openFile(fileData["id"], name)
			hideCreateFile()
		})
	window.location.reload()
}

async function deleteFiles(fileData) {
	fileData.forEach(f=>{
		console.log()
		if (document.getElementById("select"+f.id).value) {
			remoteTextApi.deleteFile(f.id)
		}
	})
	//window.location.reload()
}

async function selectAll(fileData) {

}

// open file explorer to select a file to upload
async function uploadFile(event) {
	var selectedFile = event.target.files[0]
	var name = selectedFile.name

	var contentReader = new FileReader()
	contentReader.readAsText(selectedFile)

	let content = null
	contentReader.onload = function (event) {
		content = event.target.result  // ERROR: doesn't display newlines.
		createNewFile(name, content)
	}
}

async function chooseBranch(id, name, mode) {
	await remoteTextApi.getHistory(id)
		.then(histData => {
			let branchView = document.getElementById("listBranches-" + id)
			let branchList = ""
			histData.refs.forEach(b => {
				branchList += "<button id=uploadBranchButton" + b.hash + ">" + b.name + "</button>"+
							  "<input id=uploadBranchInput"+b.hash+" type=file hidden=true></input>"
			})
			if (mode=="download") {
				branchView.innerHTML = branchList
				histData.refs.forEach(b => {
					var re = /(?:\.([^.]+))?$/
					let ext = re.exec(name)[1]
					let branchFileName = name
					if (ext != undefined) {  // check for file ext before renaming
						branchFileName = name.replace(/\.[^/.]+$/, "") + "_" + b.name + "." + ext
					} else {
						branchFileName = name + "_" + b.name
					}
					document.getElementById("uploadBranchButton"+b.hash).addEventListener("click", () => {downloadBranchFile(id, branchFileName, b.hash)})
				})
			} else if (mode=="upload") {
				branchView.innerHTML = "<div>Select parent branch:</div>" + branchList
				histData.refs.forEach(b => {  // loop through again to fill in event listeners
					document.getElementById("uploadBranchButton"+b.hash).addEventListener("click", ()=>{document.getElementById("uploadBranchInput"+b.hash).click()})
					document.getElementById("uploadBranchInput"+b.hash).addEventListener("change", (event)=>{uploadFileAsBranch(event, id, name, b.hash)})
				})
			}
		})
}

async function uploadFileAsBranch(event, id, name, parent) {
	var fileObj = {id: id, name: name, parent: parent}

	var selectedFile = event.target.files[0]
	fileObj.branch = selectedFile.name

	var contentReader = new FileReader()
	contentReader.readAsText(selectedFile)

	contentReader.onload = function (event) {
		fileObj.content = event.target.result  // ERROR: doesn't display newlines (is this fixed?)
		console.log(fileObj)
		remoteTextApi.saveFile(fileObj)
	}
	document.getElementById("listBranches-"+id).innerHTML = ""
}

async function downloadBranchFile(id, name, hash) {
	await remoteTextApi.getFile(id, hash)
		.then(fileObj => {
			var blob = new Blob([fileObj.content], {type: "text/plain;charset=utf-8"})
			saveAs(blob, name)
		})
	document.getElementById("listBranches-" + id).innerHTML = ""
}

// show hidden html elements for naming a new file
function showCreateFile() {
	document.getElementById("createFile").hidden = false
}

function hideCreateFile() {
	document.getElementById("createFile").hidden = true
}

function formatTimestamp(s) {
	let fileDate = new Date(s)
	let todaysDate = new Date()
	if (s.includes(" ")) {  // eliminates some dates for some reason getting formatted twice
		return s
	}
	if (fileDate.getDate() == todaysDate.getDate()) {
		return fileDate.toLocaleTimeString()
	} else {
		return fileDate.toDateString()
	}
}

// main export
export default function Files() {

	const [fileData, setFileData] = useState({})

	useEffect(() => {
		listFilesData()
			.then(data =>
				setFileData(data)
			)
	}, [])  // gets async data^

	let fileTable = <></>

	if (fileData && fileData.length > 0) {
		// iterate through files to reformat timestamps (couldn't do this while in map for some reason)
		fileData.forEach(file => {
			file.created_time = formatTimestamp(file.created_time)
			file.edited_time = formatTimestamp(file.edited_time)
		})

		// map file data to html elements
		let fileList = fileData.map(f =>
			<tr id={f.id} key={f.id}>
				<td>
			        <input type="checkbox" id={"select"+f.id}></input>
				</td>
				<td className={styles.nameRow}>
					<button className={styles.fileButton} id="name" onClick={() => openFile(f.id, f.name)}>{f.name}</button>
				</td>
				<td className={styles.dateRow}>{f.created_time}</td>
				<td className={styles.dateRow}>{f.edited_time}</td>
			</tr>)

		// fill html table with file elements
		fileTable = <table id="fileTable" className={styles.table}>
			<thead><tr>
				<th className={styles.checkBoxRow}><input type="checkbox" id={"selectAll"} onClick={()=>selectAll(fileData)}></input></th>
				<th className={styles.nameRow}>Name</th>
				<th className={styles.dateRow}>Created</th>
				<th className={styles.dateRow}>Modified</th>
			</tr></thead>
			<tbody>{fileList}</tbody>
		</table>

	} else { // in case of no files
		fileTable = <>You do not appear to have any files.</>
	}

	// page html
	return (
		<>
			<Header helpText="To create a new File, click the 'Create New File' button. To upload a file, click 'Upload File'. Existing Files are listed below; click a filename to start editing. " />
			<Head>
				<title>Files - RemoteText</title>
			</Head>
			<main className={styles.filesMain}>
				<h2>RemoteText Files</h2>
				<h3>Click a filename to view the file history</h3>
				<div>
					<button id="createFileButton" className={styles.createFileButton} onClick={showCreateFile}>Create New File</button>
					<button id="uploadFileButton" className={styles.createFileButton} onClick={() => document.getElementById("uploadFileInput").click()}>Upload File</button>
					<input id="uploadFileInput" type="file" onChange={() => uploadFile(event)} hidden={true}></input>
					<button id="deleteFilesButton" className={styles.createFileButton} onClick={()=>deleteFiles(fileData)} hidden={true}>Delete</button>
					<div id="createFile" hidden={true}>
						<label htmlFor="fileName">New file name:</label>
						<input type="text" id="fileName" name="fileName" required minLength="1" maxLength="64" size="10"></input>
						<button id='createFileWithGivenName' onClick={() => createNewFile(document.getElementById("fileName").value)}>Create</button>
					</div>
				</div>
				<div id="fileTable" >{fileTable}</div>
			</main>
		</>
	)
}
