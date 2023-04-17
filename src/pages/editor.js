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

// saves new contents to some branch branch
async function saveAs(fileObject, hash, branchName) {
    let newContent = document.getElementById("editor").innerHTML
    const newFileObject = {
        name: fileObject.name,
        id: fileObject.id,
        content: newContent,
        parent: hash,  // does parent also change when branch changes?
        branch: branchName
    }
    await remoteTextApi.saveFile(newFileObject)
    .then(saveResponse=>{
        window.open(document.location.origin+"/editor?id="+fileObject.id+"&name="+fileObject.name+"&hash="+saveResponse.hash, "_self")  // reload to new save
    })
}

async function saveFile(fileObject, hash){
    document.getElementById("createBranch").hidden = false
    await remoteTextApi.getHistory(fileObject.id)
    .then(histData=>{
        let branchView = document.getElementById("branchList")
        let branchList=""
        histData.refs.forEach(b=>{
            branchList += "<button id="+b.hash+">"+b.name+"</button>"
        })
        branchView.innerHTML = branchList
        histData.refs.forEach(b=>{
            document.getElementById(b.hash).addEventListener("click", ()=>{saveAs(fileObject, hash, b.name)})
        })
    })
}

async function openPreview(id, name, hash) {
    console.log(id, name, hash)
    await remoteTextApi.previewFile(id, hash)
    .then(response=>{
        console.log(response)
        if (response.state == "FAILURE") {
            document.getElementById("previewResponse").innerHTML = "Failed to compile preview :("
        } else if (response.state == "SUCCESS") {
            window.open(document.location.origin+"/preview?id="+id+"&name="+name+"&hash="+hash)
        }
    })
}

// main
export default function Editor() {
    const [fileData, setFileData] = useState({})
    const [currentHash, setCurrentHash] = useState({})
    const [contentLoadedFlag, setContentLoadedFlag] = useState({})
    useEffect(() => {
        getQueryString()
        .then(data =>{
            const urlParams = new URLSearchParams(data)
            const fileID = urlParams.get('id')
            const fileHash = urlParams.get('hash')
            setCurrentHash(fileHash)

            getFileData(fileID, fileHash)
            .then(data => {setFileData(data)}) // fileData contains name, id, & content.
            setContentLoadedFlag(false)
        })        
    }, [])   // ^this runs only once on load

    setContent(fileData.content, contentLoadedFlag)

    return (
        <>
            <Head>
                <title>{fileData.name} - Editor</title>
            </Head>
            <main className={styles.main}>
                <div id="editorHeader">
                    <div id="saveTools">
                        <button id="saveButton" onClick={()=>saveFile(fileData, currentHash)}>Save File</button>
                        <div id="branchList"></div>
                        <div id="createBranch" hidden={true}>
                            <label htmlFor="branchName">New branch:</label>
                            <input type="text" id="branchName" name="branchName" required minLength="1" maxLength="64" size="10"></input>
                            <button onClick={()=>saveAs(fileData, currentHash, document.getElementById("branchName").value)}>Create new branch</button>
                        </div>
                    </div>
                    <button id="previewButton" onClick={()=>openPreview(fileData.id, currentHash, fileData.name)}>Preview File</button>
                    <div id="previewResponse"></div>
                </div>
            
                <div className="editor" contentEditable="true" id="editor"></div>
            </main>
        </>
    )
}
