import Head from "next/head"
import styles from "../styles/Home.module.css"
import RemoteTextApi from "../externalApis/remoteTextApi.js"
import React, { useEffect, useState } from "react"

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

export default function Preview() {
    const [previewData, setPreviewData] = useState({})
    const [fileName, setFileName] = useState({})
    useEffect(() => {
        getQueryString()
        .then(data =>{
            const urlParams = new URLSearchParams(data)
            const fileID = urlParams.get('id')
            const fileHash = urlParams.get('hash')
            setFileName(urlParams.get('name'))
            remoteTextApi.getPreview(fileID, fileHash)
            .then(file => {setPreviewData(file)})
        })
    }, [])   // ^this runs only once on load

    console.log(previewData)

    return <>
        <Head>
            <title>{fileName} - Preview</title>
        </Head>
        <main>
            ...
        </main>
    </>
}