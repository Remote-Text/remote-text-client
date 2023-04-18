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
    const [labels, setLabels] = useState({})
    useEffect(() => {
        getQueryString()
        .then(data =>{
            const urlParams = new URLSearchParams(data)
            const fileID = urlParams.get('id')
            const fileHash = urlParams.get('hash')
            setLabels({
                        fileName: urlParams.get('name'),
                        branchName: urlParams.get('branch')
                    })
            remoteTextApi.getPreview(fileID, fileHash)
            .then(file => {setPreviewData(file)})
        })
    }, [])   // ^this runs only once on load

    console.log(previewData)

    return <>
        <Head>
            <title>{labels.fileName} ({labels.branchName}) - Preview</title>
        </Head>
        <main>
            ...
        </main>
    </>
}