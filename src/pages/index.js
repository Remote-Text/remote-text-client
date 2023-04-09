import Head from 'next/head'
import Link from 'next/link'
import styles from '../styles/Home.module.css'
import RemoteTextApi from '../externalApis/remoteTextApi.js'

const remoteTextApi = new RemoteTextApi();

// a function like this could get our git history, get a file and load the editor, etc
// right now it just console logs
async function logListFiles() {

	// this will throw unless server is up
	console.log(await remoteTextApi.listFiles());
}

async function logCreateFile() {
	console.log(await remoteTextApi.createFile("foo.txt"));
}

async function logSaveFile() {
	var testFile = {
		name: "foo.txt",
		id: "aec23664ae26d76ab66cedfb1206b9c9",
		content: "hello world!",
	}
	console.log(await remoteTextApi.saveFile(testFile));
}

async function logPreviewFile() {
	var testFile = {
		id: "aec23664ae26d76ab66cedfb1206b9c9",
		hash: "aceaaec23664ae26d76ab66cedfb1206b9c972b1"
	}
	console.log(await remoteTextApi.previewFile(testFile.id, testFile.hash))
}

async function logGetPreview() {
	var testFile = {
		id: "aec23664ae26d76ab66cedfb1206b9c9",
		hash: "aceaaec23664ae26d76ab66cedfb1206b9c972b1"
	}
	console.log(await remoteTextApi.getPreview(testFile.id, testFile.hash))
}

async function logGetFile(){
	console.log(await remoteTextApi.getFile("0".repeat(32)))
}

async function logGetHistory(){
	console.log(await remoteTextApi.getHistory("0".repeat(32)))
}

async function logDeleteFile() {
	console.log(await remoteTextApi.deleteFile("0".repeat(32)))
}

export default function Home() {

	return (
		<>
			<main className={styles.main}>
				<div className={styles.description}>
					<p>
						Hello World! Press buttons to see API calls in console
					</p>
				</div>
				<button id="listFiles" onClick={logListFiles}>ListFiles</button>
				<button id="createFile" onClick={logCreateFile}>CreateFile</button>
				<button id="saveFile" onClick={logSaveFile}>SaveFile</button>
				<button id="previewFile" onClick={logPreviewFile}>PreviewFile</button>
				<button id="getPreview" onClick={logGetPreview}>GetPreview</button>
				<button id="getFile" onClick={logGetFile}>GetFile</button>
				<button id="getHistory" onClick={logGetHistory}>GetHistory</button>
				<button id="deleteFile" onClick={logDeleteFile}>DeleteFile</button>
				<Link id="historyPageLink" href="/history">History Page</Link>
			</main>
		</>
	)

}
