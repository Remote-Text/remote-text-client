import styles from './index.js'
import Head from "next/head"
import React, { useEffect, useState } from 'react'
import RemoteTextApi from '../externalApis/remoteTextApi.js'
//var error_throw = "                __ \n               / _) \n      _.----._/ / \n     /   error / \n  __/ (  | (  | \n /__.-'|_|--|_|"

const remoteTextApi = new RemoteTextApi()

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
        let contentHTML = content.replaceAll("\n", "<br>")
        document.getElementById("editor").innerHTML = contentHTML
        return true
    } else {
        return false
    }
}

// saves new contents to some branch branch
async function saveAs(fileData, branchData, name) {
    let contentElement = document.getElementById("editor")
    let newContentStr = contentElement.innerHTML.replaceAll("<br>", "\n")
    const newFileObject = {
        name: fileData.name,
        id: fileData.id,
        content: newContentStr,
        parent: branchData.hash,
        branch: name
    }
    await remoteTextApi.saveFile(newFileObject)
    .then(saveResponse=>{
        window.open(document.location.origin+"/editor?id="+fileData.id+"&name="+fileData.name+"&hash="+saveResponse.hash+"&branch="+name, "_self")  // reload to new save
    })
}

async function saveFile(fileData, branchData){
    document.getElementById("createBranch").hidden = false
    await remoteTextApi.getHistory(fileData.id)
    .then(histData=>{
        let branchView = document.getElementById("branchList")
        let branchList=""
        histData.refs.forEach(b=>{
            branchList += "<button id="+b.hash+">"+b.name+"</button>"
        })
        branchView.innerHTML = branchList
        histData.refs.forEach(b=>{
            document.getElementById(b.hash).addEventListener("click", ()=>{saveAs(fileData, branchData, b.name)})
        })
    })
}

function saveNew(fileData, branchData, name) {
    if (name != "") {  // check if valid name (should we make these criteria more specific?)
        saveAs(fileData, branchData, name)
    } else{
        document.getElementById("invalidBranchName").hidden = false
    }
}

async function openPreview(fileData, branchData) {
    await remoteTextApi.previewFile(fileData.id, branchData.hash)
    .then(response=>{
        if (response.state == "FAILURE") {
            document.getElementById("previewResponse").innerHTML = "Failed to compile preview :("
        } else if (response.state == "SUCCESS") {
            window.open(document.location.origin+"/preview?id="+fileData.id+"&name="+fileData.name+"&hash="+branchData.hash+"&branch="+branchData.name)
        }
    })
}

// main
export default function Editor() {
    const [fileData, setFileData] = useState({})
    const [branchData, setBranchData] = useState({})
    const [contentLoadedFlag, setContentLoadedFlag] = useState({})
    useEffect(() => {
        getQueryString()
        .then(data =>{
            const urlParams = new URLSearchParams(data)
            const fileID = urlParams.get('id')
            const fileHash = urlParams.get('hash')
            const branchName = urlParams.get('branch')
            setBranchData({hash: fileHash, name: branchName})

            getFileData(fileID, fileHash)
            .then(data => {setFileData(data)}) // fileData contains name, id, & content.
            setContentLoadedFlag(false)
        })        
    }, [])   // ^this runs only once on load

    setContent(fileData.content, contentLoadedFlag)

    return (
        <>
            <Head>
                <title>{fileData.name} ({branchData.name}) - Editor</title>
            </Head>
            <main className={styles.main}>
                <div id="editorHeader">
                    <div id="saveTools">
                        <button id="saveButton" onClick={()=>saveFile(fileData, branchData)}>Save File</button>
                        <div id="branchList"></div>
                        <div id="createBranch" hidden={true}>
                            <label htmlFor="branchName">New branch:</label>
                            <input type="text" id="branchName" name="branchName" required minLength="1" maxLength="64" size="10"></input>
                            <button onClick={()=>saveNew(fileData, branchData, document.getElementById("branchName").value)}>Create new branch</button>
                            <p id="invalidBranchName" hidden={true}>Not a valid branch name.</p>
                        </div>
                    </div>
                    <button id="previewButton" onClick={()=>openPreview(fileData, branchData)}>Preview File</button>
                    <div id="previewResponse"></div>
                </div>
            
                <div className="editor" contentEditable="true" id="editor"></div>
            </main>
        </>
    )
}
