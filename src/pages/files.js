import Head from 'next/head'
import styles from '../styles/Home.module.css'
import RemoteTextApi from '../externalApis/remoteTextApi.js'
import React, { useEffect, useState } from 'react'

const remoteTextApi = new RemoteTextApi()

async function awaitListFiles() {
	await remoteTextApi.listFiles()
  .then(filesData => {
    console.log(filesData)
    return filesData
  })
  .catch(error => {
    console.log(error.response)
  })
}

function getFile(id) {  // placeholder for opening next page to view/edit selected file
  console.log('get file with id='+id)
}

function listFileButtons(jsonList) {
  if (jsonList.length > 0) {
    jsonList.forEach((fileJson)=>{
      let fileName = fileJson['name']
      let fileId = fileJson['id']
      //combine? (<button onClick={() => getFile(fileId)}>{fileName}</button>)
    })
    return (<p>Doing something here!</p>)
  } else {
    console.log('here!')
    return <p>It doesn't look like you have any files at the moment.</p>
  }
}

export default function Files() {
  console.log("await: ", awaitListFiles())

  const [listFiles, displayListFiles] = useState({});

  useEffect(() => {
    awaitListFiles()
    .then(data => displayListFiles(data))
  }, [])

  console.log("data? ", listFiles)

  return(
    <>
      <Head>
        <title>Files - RemoteText</title>
      </Head>
      <main className = {styles.main}>
        <div id='text' className={styles.description}>
          <p>these are some files:</p>
				</div>
      </main>
    </>
  )
}
