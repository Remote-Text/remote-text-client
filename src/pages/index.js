import Head from 'next/head'
import { Inter } from 'next/font/google'
import styles from '../styles/Home.module.css'
import RemoteTextApi from '../externalApis/remoteTextApi.js'
const inter = Inter({ subsets: ['latin'] })

const remoteTextApi = new RemoteTextApi();

// a function like this could get our git history, get a file and load the editor, etc
// right now it just console logs
function logGetFiles(){
	
	// this will throw unless server is up
	console.log(remoteTextApi.getFiles());
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
	  HELLO WORLD
          </p>
	  	</div>
	  <button onClick={logGetFiles}>Default</button>
      </main>
    </>
  )
}
