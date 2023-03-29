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

function formatTimestamp(s) {
  let parts = s.split('T')
  if (parts.length > 1) {  // because for some reason it was running date strings through this twice
    let date = parts[0]
    let time = (parts[1]).split('.')[0]

    let today = new Date()
    let todaysDate = (today.getFullYear()).toString() + (today.getMonth() + 1).toString() + (today.getDate()).toString() // need to adjust month by 1 because js date format has months start from 0

    if (date == todaysDate) {
      return time
    } else {
      return date
    }
  } else {
    return s
  }
}

export default function Files() {  
  const [fileData, setFileData] = useState({})

  useEffect(() => {
    getFileData()
   .then(data =>
     setFileData(data)
   )
  }, [])

  let fileTable = <>Sorry, we couldn't find any files.</>

  if (fileData.length > 0) {
    fileData.forEach(file => {
      file.created_time = formatTimestamp(file.created_time)
      file.edited_time = formatTimestamp(file.edited_time)
    })

    let fileList = fileData.map(f =>
    <tr key={f.id}>
      <td>{f.name}</td>
      <td>{f.created_time}</td>
      <td>{f.edited_time}</td>
      <td><button onClick={() => getFile(f.id)}>open file</button></td>
    </tr>)

    fileTable = <table className={styles.fileTable}>
      <thead><tr>
        <th>Name</th>
        <th>Created</th>
        <th>Last Edited</th>
      </tr></thead>
      <tbody>{fileList}</tbody>
    </table>
  }

  return(
    <>
      <Head>
        <title>Files - RemoteText</title>
      </Head>
      <main className = {styles.main}>
        <h2>RemoteText Files:</h2>
        <div>{fileTable}</div>
      </main>
    </>
  )
}
