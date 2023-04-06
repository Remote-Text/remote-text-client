import styles from './index.js'
import Head from "next/head"
import React, { useEffect, useState } from 'react'
import RemoteTextApi from '../externalApis/remoteTextApi.js'
//var error_throw = "                __ \n               / _) \n      _.----._/ / \n     /   error / \n  __/ (  | (  | \n /__.-'|_|--|_|"

const remoteTextApi = new RemoteTextApi();

async function logContents() {
    console.log(document.getElementById("editor").innerHTML)
    //var updatedContent = document.getElementById(element_id)
    //console.log(updatedContent)
}

async function setContents() {
    var testFile = {
        name: "foo.txt",
        id: "aec23664ae26d76ab66cedfb1206b9c9",
        content: "hello world! is this working? I think it is",
    }
    document.getElementById("editor").innerHTML = testFile.content

}

async function getQueryString() {
    let queryString = window.location.search
    let queryStringPromise = new Promise((resolve) => {
        if (queryString != undefined) {
            resolve(queryString)
        }
    })
    return queryStringPromise
}




export default function Home() {
    const [queryString, setQueryString] = useState({})
    useEffect(() => {
        getQueryString()
            .then(data =>
                setQueryString(data)
            )
    })

    const urlParams = new URLSearchParams(queryString)
    const fileID = urlParams.get('id')
    const fileHash = urlParams.get('hash')
    const fileContents = remoteTextApi.getFile(fileID, 'HEAD')

    //setContents()
    return (
        <>
            <Head onLoad={setContents}>
                <title>Hello World</title>
            </Head>
            <main className={styles.main} onLoad={logContents} >
                <a href="../">Return to main</a>
                <div className="edit-content" onLoad={setContents}>
                    <p className="loading" id="loading">Editor Below</p>
                    <button id="saveFile" onClick={logContents}>SaveFile</button>
                    <button id="setContents" onClick={setContents}>SetContents</button>
                    <div className="editor" contentEditable="true" id="editor" onLoadingComplete={setContents}>Edit here...</div>
                    <div>File ID = {fileID}</div>
                    <div>File Hash = {fileHash}</div>

                </div>
            </main >


        </>
    )

}

