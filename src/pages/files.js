import Head from 'next/head'
import styles from '../styles/Home.module.css'
import RemoteTextApi from '../externalApis/remoteTextApi.js'
import React, { useEffect, useState } from 'react'

const remoteTextApi = new RemoteTextApi()

function getFile(id) {  // placeholder for opening next page to view/edit selected file
  console.log('get file with id='+id)
}

async function getFileData() {
  let fileData = remoteTextApi.listFiles()
  let filePromise = new Promise((resolve) => {
    if (fileData != undefined) {
      resolve(fileData)}
  })
  return filePromise
}

export default function Files() {  
  const [fileData, setFileData] = useState({})

  useEffect(() => {
    getFileData()
   .then(data =>
     setFileData(data)
   )
  }, [])

  let fileList = <>...</>

  if (fileData.length > 0) {
    fileList = fileData.map(f =>
      <button key={f.id} onClick={() => getFile(f.id)}>
        {f.name}
      </button>
    )
  }

  return(
    <>
      <Head>
        <title>Files - RemoteText</title>
      </Head>
      <main className = {styles.main}>
        <div id='text' className={styles.description}>
          <ul>
            RemoteText Files: <br></br><br></br>
            {fileList}
          </ul>
				</div>
      </main>
    </>
  )
}
