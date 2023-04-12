import Head from "next/head"
import styles from "../styles/Home.module.css"
import RemoteTextApi from "../externalApis/remoteTextApi.js"
import React, {useEffect, useState} from "react"

const remoteTextApi = new RemoteTextApi()

function openFile(id) {
	window.open(document.location.origin + "/history?id=" + id)
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
async function createNewFile() {
	let name = document.getElementById("fileName").value
	await remoteTextApi.createFile(name)
		.then(fileData => {
			openFile(fileData["id"])
			hideCreateFile()
		})
}

// show hidden html elements for naming a new file
function showCreateFile() {
	document.getElementById("createFile").hidden = false
}

function hideCreateFile() {
	document.getElementById("createFile").hidden = true
}

// open file explorer to select a file to upload
function chooseUploadFile() {
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

	if (fileData.length > 0) {
		// iterate through files to reformat timestamps (couldn't do this while in map for some reason)
		fileData.forEach(file => {
			file.created_time = formatTimestamp(file.created_time)
			file.edited_time = formatTimestamp(file.edited_time)
		})

		// map file data to html elements
		let fileList = fileData.map(f =>
			<tr id={f.id} key={f.id}>
				<td id="name" className={styles.nameRow}>
					<button className={styles.fileButton} onClick={() => openFile(f.id)}>{f.name}</button>
				</td>
				<td className={styles.dateRow}>{f.created_time}</td>
				<td className={styles.dateRow}>{f.edited_time}</td>
			</tr>)

		// fill html table with file elements
		fileTable = <table id="fileTable" className={styles.table}>
			<thead><tr>
				<th className={styles.nameRow}>Name</th>
				<th className={styles.dateRow}>Created</th>
				<th className={styles.dateRow}>Modified</th>
			</tr></thead>
			<tbody>{fileList}</tbody>
		</table>

	} else { // in case of no files
		fileTable = <div id="fileTable" >You do not appear to have any files.</div>
	}

	// page html
	return (
		<>
			<Head>
				<title>Files - RemoteText</title>
			</Head>
			<main className={styles.filesMain}>
				<h2>RemoteText Files</h2>
				<div>
					<button className={styles.createFileButton} onClick={showCreateFile}>Create New File</button>
					<button className={styles.createFileButton} onClick={chooseUploadFile}>Upload File</button>
					<div id="createFile" hidden={true}>
						<label htmlFor="fileName">New file name:</label>
						<input type="text" id="fileName" name="fileName" required minLength="1" maxLength="64" size="10"></input>
						<button onClick={createNewFile}>Create</button>
					</div>
				</div>
				<div>{fileTable}</div>
			</main>
		</>
	)
}
