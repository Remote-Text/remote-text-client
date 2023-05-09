import Head from "next/head"
import RemoteTextApi from "../externalApis/remoteTextApi.js"
import React, {useEffect, useState} from "react"
import {saveAs} from 'file-saver'

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

function loadPdf(preview, labels) {
	// just dealing with file naming:
	let fname = labels.fileName
	let bname = labels.branchName
	var re = /(?:\.([^.]+))?$/
	let ext = re.exec(fname)[1]
	let branchFileName = ""
	if (ext != undefined) {  // check for file ext before renaming
		branchFileName = fname.replace(/\.[^/.]+$/, "") + "_" + bname + ".pdf"
	} else {
		branchFileName = fname + "_" + bname
	}
	// saving pdf:
	var blob = new Blob([preview], {type: 'application/pdf'})
	saveAs(blob, branchFileName)
	setTimeout(function () {
		window.close()
	}, 10)
}

export default function Preview() {
	const [previewData, setPreviewData] = useState({})
	const [labels, setLabels] = useState({})
	useEffect(() => {
		getQueryString()
			.then(data => {
				const urlParams = new URLSearchParams(data)
				const fileID = urlParams.get('id')
				const fileHash = urlParams.get('hash')
				setLabels({
					fileName: urlParams.get('name'),
					branchName: urlParams.get('branch')
				})
				remoteTextApi.getPreview(fileID, fileHash)
					.then(data => {setPreviewData(data)})
			})
	}, [])   // ^this runs only once on load

	let htmlPreview = ""
	if (previewData.byteLength > 0) {
		let decoder = new TextDecoder("utf-8")
		let typeData = new DataView(previewData, 1, 3)
		if (decoder.decode(typeData) == "PDF") {
			loadPdf(previewData, labels)
		} else {
			htmlPreview = decoder.decode(previewData, {stream: true})
		}
	}

	return <>
		<Head>
			<title>{labels.fileName} ({labels.branchName}) - Preview</title>
		</Head>
		<main>
			<div id="preview" dangerouslySetInnerHTML={{__html: htmlPreview}}></div>
		</main>
	</>
}
