import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import {getActivities } from '@/api/hello.js'
const inter = Inter({ subsets: ['latin'] })

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
	  <button onClick={getActivities}>Default</button>
      </main>
    </>
  )
}
