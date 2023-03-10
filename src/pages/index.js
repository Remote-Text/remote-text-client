import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '../styles/Home.module.css'
import BoredApi from '../externalApis/boredApi.js'
const inter = Inter({ subsets: ['latin'] })

const boredapi = new BoredApi();

// a function like this could get our git history, get a file and load the editor, etc
// right now it just console logs
function logActivities(){
	
	boredapi.getActivities();
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
	  <button onClick={logActivities}>Default</button>
      </main>
    </>
  )
}
