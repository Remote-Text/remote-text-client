import Head from "next/head"
import styles from "../styles/Home.module.css"
import RemoteTextApi from "../externalApis/remoteTextApi.js"
import React, { useEffect, useState } from "react"

const remoteTextApi = new RemoteTextApi()

function openFile(nextPage, id) {  // parameter nextPage is a string indicating whether to open file tree or editor
  window.open(document.location.origin+"/"+nextPage+"?id="+id)
}

// dealing with API call listFiles promise
async function listFilesData() {
  let fileData = remoteTextApi.listFiles()
  let filePromise = new Promise((resolve) => {
    if (fileData != undefined) {
      resolve(fileData)
    }
  })
  return filePromise
}

// read data from createFile API call and open new file
async function createNewFile() {
  let name = document.getElementById("fileName").value
  await remoteTextApi.createFile(name)
  .then(fileData=>{
    openFile("history", fileData["id"])
  })
}

// show hidden html elements for naming a new file
function showCreateFile() {
  document.getElementById("createFile").hidden = false
}

// open file explorer to select a file to upload
function chooseUploadFile() {
}

// reformat date/time strings received from server
function formatTimestamp(s) {
  let parts = s.split("T")
  if (parts.length > 1) {  // because for some reason it was running date strings through this twice
    let date = parts[0]
    let time = (parts[1]).split(".")[0]

    let today = new Date()
    let todaysDate = (today.getFullYear()).toString() + (today.getMonth() + 1).toString() + (today.getDate()).toString() // need to adjust month by 1 because js date format has months start from 0

    if (date == todaysDate) {
      let timeParts = time.split(":")
      let hour = timeParts[0]
      let minute = timeParts[1]
      let formattedTime = ""
      if (hour>12) {
        formattedTime = (hour-12) + ":" + minute + "pm"
      } else {
        formattedTime = (hour) + ":" + minute + "am"
      }
      return formattedTime

    } else {
      let dateParts = date.split("-")
      let year = dateParts[0]
      let month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][dateParts[1]-1]
      let day = dateParts[2]
      return (month + " " + day + ", " + year)
    }

  } else {
    return s
  }
}

// main export
export default function Files() {  
  const [fileData, setFileData] = useState({})

  useEffect(() => {
    listFilesData()
    .then(data =>
      setFileData(data)
    )
  }, [])  // gets async data^

  let fileTable = <></>

  if (fileData.length > 0) {
    // iterate through files to reformat timestamps (couldn"t do this while in map for some reason)
    fileData.forEach(file => {
      file.created_time = formatTimestamp(file.created_time)
      file.edited_time = formatTimestamp(file.edited_time)
    })

    // map file data to html elements
    let fileList = fileData.map(f =>
    <tr key={f.id}>
      <td className={styles.nameRow}>
        <button className={styles.fileButton} onClick={()=>openFile("history", f.id)}>{f.name}</button>
      </td>
      <td className={styles.dateRow}>{f.created_time}</td>
      <td className={styles.dateRow}>{f.edited_time}</td>
    </tr>)

    // fill html table with file elements
    fileTable = <table className={styles.table}>
      <thead><tr>
        <th className={styles.nameRow}>Name</th>
        <th className={styles.dateRow}>Created</th>
        <th className={styles.dateRow}>Modified</th>
      </tr></thead>
      <tbody>{fileList}</tbody>
    </table>

  } else { // in case of no files
    fileTable = <>You do not appear to have any files.</>
  }

  // page html
  return(
    <>
      <Head>
        <title>Files - RemoteText</title>
      </Head>
      <main className = {styles.filesMain}>
        <h2>RemoteText Files</h2>
        <div>
          <button className={styles.createFileButton} onClick={showCreateFile}>Create New File</button>
          <button className={styles.createFileButton} onClick={chooseUploadFile}>Upload File</button>
          <div id="createFile" hidden={true}>
            <label htmlFor="fileName">New file name:</label>
            <input type="text" id="fileName" name="fileName" required minLength="1" maxLength="64" size="10"></input>
            <button onClick={createNewFile}>Create</button>
          </div>
        </div>
        <div>{fileTable}</div>
      </main>
    </>
  )
}
