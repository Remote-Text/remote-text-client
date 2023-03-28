import React from 'react'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import RemoteTextApi from '../externalApis/remoteTextApi.js'

const remoteTextApi = new RemoteTextApi()

async function awaitListFiles() {
	return await remoteTextApi.listFiles()
}

function getFile(id) {  // placeholder for opening next page to view/edit selected file
  console.log('get file with id='+id)
}

function printFiles(fileList) {
  let htmlStr = ''
  fileList.forEach((file)=>{
    let name = file['name']
    let id = file['id']
    htmlStr += "<button onClick={getFile('"+id+"')}>"+name+"</button><br>"
  })
  return htmlStr
}

export default function Files() {
  awaitListFiles().then(jsonList => {
    let htmlStr = printFiles(jsonList)
    if (htmlStr == '') {
      htmlStr = "<p>It doesn't look like you have any files at the moment.</p>"
    }
    text.innerHTML = htmlStr
  })

  return (
    <>
      <Head>
        <title>Files - RemoteText</title>
      </Head>
      <main className = {styles.main}>
        <div id='text' className={styles.description}>
				</div>
      </main>
    </>
  )
}
