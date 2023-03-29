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
      let timeParts = time.split(':')
      let hour = timeParts[0]
      let minute = timeParts[1]
      let formattedTime = ''
      if (hour>12) {
        formattedTime = (hour-12) + ':' + minute + 'pm'
      } else {
        formattedTime = (hour) + ':' + minute + 'am'
      }
      return formattedTime

    } else {
      let dateParts = date.split('-')
      let year = dateParts[0]
      let month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][dateParts[1]-1]
      let day = dateParts[2]
      return (month + ' ' + day + ', ' + year)
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
      <td className={styles.nameRow}><button className={styles.fileButton} onClick={() => getFile(f.id)}>{f.name}</button></td>
      <td className={styles.dateRow}>{f.created_time}</td>
      <td className={styles.dateRow}>{f.edited_time}</td>
    </tr>)

    fileTable = <table className={styles.table}>
      <thead><tr>
        <th className={styles.nameRow}>Name</th>
        <th className={styles.dateRow}>Created</th>
        <th className={styles.dateRow}>Last Edited</th>
      </tr></thead>
      <tbody>{fileList}</tbody>
    </table>
  }

  return(
    <>
      <Head>
        <title>Files - RemoteText</title>
      </Head>
      <main className = {styles.filesMain}>
        <h2>RemoteText Files</h2>
        <div>{fileTable}</div>
      </main>
    </>
  )
}
