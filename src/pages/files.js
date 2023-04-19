import Head from "next/head"
import styles from "../styles/Home.module.css"
import RemoteTextApi from "../externalApis/remoteTextApi.js"
import React, { useEffect, useState } from "react"
import { saveAs } from 'file-saver'

const remoteTextApi = new RemoteTextApi()

function openFile(id, fileName) {
  window.open(document.location.origin+"/history?id="+id+"&name="+fileName)
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
async function createNewFile(name, fileContent="") {
  await remoteTextApi.createFile(name, fileContent)
  .then(fileData=>{
    openFile(fileData["id"], name)
    hideCreateFile()
  })
  window.location.reload()
}

async function deleteFile(id) {
  await remoteTextApi.deleteFile(id)
  .then()
  window.location.reload()
}

// open file explorer to select a file to upload
async function uploadFile(event){
  var selectedFile = event.target.files[0]
  var name = selectedFile.name
  
  var contentReader = new FileReader()
  contentReader.readAsText(selectedFile)
  
  let content = null
  contentReader.onload = function(event) {
    content = event.target.result  // ERROR: doesn't display newlines.
    createNewFile(name, content)
  }
}

async function downloadFile(id, name){
  await remoteTextApi.getHistory(id)
  .then(histData=>{
    let branchView = document.getElementById("listBranches-"+id)
    let branchList=""
    histData.refs.forEach(b=>{
      branchList += "<button id="+b.hash+">"+b.name+"</button>"
    })
    branchView.innerHTML = branchList
    histData.refs.forEach(b=>{
      var re = /(?:\.([^.]+))?$/
      let ext = re.exec(name)[1]
      let branchFileName = name
      if (ext != undefined){  // check for file ext before renaming
        branchFileName = name.replace(/\.[^/.]+$/, "") + "_" + b.name + "." + ext
      } else {
        branchFileName = name + "_" + b.name
      }
      document.getElementById(b.hash).addEventListener("click", ()=>{downloadBranchFile(id, branchFileName, b.hash)})
    })
  })
}

async function downloadBranchFile(id, name, hash) {
  await remoteTextApi.getFile(id, hash)
  .then(fileObj=>{
    var blob = new Blob([fileObj.content], {type: "text/plain;charset=utf-8"})
    saveAs(blob, name)
  })
  document.getElementById("listBranches-"+id).innerHTML=""
}

// show hidden html elements for naming a new file
function showCreateFile() {
  document.getElementById("createFile").hidden = false
}

function hideCreateFile() {
  document.getElementById("createFile").hidden = true
}

function formatTimestamp(s) {
  let fileDate = new Date(s)
  let todaysDate = new Date()
  if (s.includes(" ")) {  // eliminates some dates for some reason getting formatted twice
    return s
  }
  if (fileDate.getDate() == todaysDate.getDate()) {
    return fileDate.toLocaleTimeString()
  } else {
    return fileDate.toDateString()
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
    // iterate through files to reformat timestamps (couldn't do this while in map for some reason)
    fileData.forEach(file => {
      file.created_time = formatTimestamp(file.created_time)
      file.edited_time = formatTimestamp(file.edited_time)
    })

    // map file data to html elements
    let fileList = fileData.map(f =>
    <tr key={f.id}>
      <td><button id="deleteFile" onClick={()=>deleteFile(f.id)}>Delete</button></td>
      <td><button id="downloadFile" onClick={()=>downloadFile(f.id, f.name)}>Download</button>
        <div id={"listBranches-"+f.id}></div>
      </td>
      <td className={styles.nameRow}>
        <button className={styles.fileButton} onClick={()=>openFile(f.id, f.name)}>{f.name}</button>
      </td>
      <td className={styles.dateRow}>{f.created_time}</td>
      <td className={styles.dateRow}>{f.edited_time}</td>
    </tr>)

    // fill html table with file elements
    fileTable = <table className={styles.table}>
      <thead><tr>
        <th></th>
        <th></th>
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
          <button id="createFileButton" className={styles.createFileButton} onClick={showCreateFile}>Create New File</button>
          <button id="uploadFileButton" className={styles.createFileButton} onClick={()=>document.getElementById("uploadFileInput").click()}>Upload File</button>
          <input id="uploadFileInput" type="file" onChange={()=>uploadFile(event)} hidden={true}></input>
          <div id="createFile" hidden={true}>
            <label htmlFor="fileName">New file name:</label>
            <input type="text" id="fileName" name="fileName" required minLength="1" maxLength="64" size="10"></input>
            <button onClick={()=>createNewFile(document.getElementById("fileName").value)}>Create</button>
          </div>
        </div>
        <div>{fileTable}</div>
      </main>
    </>
  )
}
