import Head from 'next/head'
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

async function logGetPreview() {
	var testFile = {
		name: "foo.txt",
		id: "aec23664ae26d76ab66cedfb1206b9c9",
		content: "hello world!",
	}
	console.log(await remoteTextApi.getPreview(testFile))
}

export default function Home() {
	return (
		<>
			<Head>
				<title>Hello World</title>
			</Head>
			<main className={styles.main}>
				<div className={styles.description}>
					<p>
						Hello World! Press buttons to see API calls in console
					</p>
				</div>
				<button id="listFiles" onClick={logListFiles}>ListFiles</button>
				<button id="createFile" onClick={logCreateFile}>CreateFile</button>
				<button id="saveFile" onClick={logSaveFile}>SaveFile</button>
				<button id="getPreview" onClick={logGetPreview}>getPreview</button>
			</main>
		</>
	)
}
