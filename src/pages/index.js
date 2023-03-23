import Head from 'next/head'
import styles from '../styles/Home.module.css'
import RemoteTextApi from '../externalApis/remoteTextApi.js'

const remoteTextApi = new RemoteTextApi();

// a function like this could get our git history, get a file and load the editor, etc
// right now it just console logs
async function logListFiles(){
	
	// this will throw unless server is up
	 console.log(await remoteTextApi.listFiles());
}

async function logCreateFile(){
	 console.log(await remoteTextApi.createFile("foo.txt"));
}

async function logGetFile(){
	console.log(await remoteTextApi.getFile("SOME_ID"))
}

async function logGetHistory(){
	console.log(await remoteTextApi.getFile("SOME_ID"))
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
			  <button id="getFile" onClick={logGetFile}>GetFile</button>
			  <button id="getHistory" onClick={logGetHistory}>GetHistory</button>
		  </main>
	  </>
  )
}
