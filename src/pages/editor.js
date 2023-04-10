import styles from './index.js'
import Head from "next/head"
import React, { useEffect, useState } from 'react'
import RemoteTextApi from '../externalApis/remoteTextApi.js'
//var error_throw = "                __ \n               / _) \n      _.----._/ / \n     /   error / \n  __/ (  | (  | \n /__.-'|_|--|_|"

const remoteTextApi = new RemoteTextApi();

// for dealing with parameters
async function getQueryString() {
    let queryString = window.location.search
    let queryStringPromise = new Promise((resolve) => {
        if (queryString != undefined) {
            resolve(queryString)
        }
    })
    return queryStringPromise
}

// for dealing with API calls:
async function getFileData(id, hash) {
/*    let fileData = {        // Dummy data
        name: "foo.txt",
        id: "aec23664ae26d76ab66cedfb1206b9c9",
        content: "hello world! is this working? I think it is",
    }*/
    let fileData = await remoteTextApi.getFile(id, hash)
    let filePromise = new Promise((resolve) => {
        if (fileData != undefined) {
            resolve(fileData)
        }
    })
    return filePromise
}

// this seems like a strange work-around to only loading correct content once, but I couldn't figure out a better alternative.
function setContent(content, flag) {
    if (content != undefined && !flag) {
        document.getElementById("editor").innerHTML = content
        return true
    } else {
        return false
    }
}

//  send new contents back to API & return hash & parent from API call
async function saveFile(name, id, newContent) {
    const fileObject = {
        name: name,
        id: id,
        content: newContent
    }
    await remoteTextApi.saveFile(fileObject)
    .then(saveResponse=>
        console.log("File saved! API response:", saveResponse)  // unsure what we're supposed to do with this info (hash & parent)
    )
}

// main
export default function Editor() {
    const [fileData, setFileData] = useState({})
    const [contentLoadedFlag, setContentLoadedFlag] = useState({})
    useEffect(() => {
        getQueryString()
        .then(data =>{
            const urlParams = new URLSearchParams(data)
            const fileID = urlParams.get('id')
            const fileHash = urlParams.get('hash')

            getFileData(fileID, fileHash)
            .then(data => {setFileData(data)})
            setContentLoadedFlag(false)
        })        
    }, [])   // ^this runs only once on load

    setContent(fileData.content, contentLoadedFlag)

    return (
        <>
            <Head>
                <title>{fileData.name}</title>
            </Head>
            <main className={styles.main}>
                <div className="editor" contentEditable="true" id="editor"></div>
                <button onClick={()=>saveFile(fileData.name, fileData.id, document.getElementById("editor").innerHTML)}>SaveFile</button>
            </main >
        </>
    )
}
