import Link from 'next/link'
import styles from '../styles/Home.module.css'
import RemoteTextApi from '../externalApis/remoteTextApi.js'
import Head from "next/head"



const remoteTextApi = new RemoteTextApi();

export default function Home() {

	return (
		<>

			<Head>
				<title>RemoteText</title>
			</Head>

			<div className={styles.indexPage}>
				<img src="/logo.png" alt="my_Logo"></img>
				<div>
					<h1>Welcome to RemoteText!</h1>
					<p>This is an open source text file editor with version control</p></div>
				<Link href="/files"><button>View Files</button></Link>
				<a href="https://github.com/Remote-Text">
					<button>See code on Github</button>
				</a>

			</div>
		</>
	)

}
