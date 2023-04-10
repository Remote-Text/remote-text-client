import RemoteTextApi from '../externalApis/remoteTextApi.js'
import React, { useEffect, useState } from 'react'

// URL format ex: http://localhost:3000/test-page?id=thisIsAnID&hash=thisIsAHash

const remoteTextApi = new RemoteTextApi()

async function getQueryString() {
  let queryString = window.location.search
  let queryStringPromise = new Promise((resolve) => {
    if (queryString != undefined) {
      resolve(queryString)
    }
  })
  return queryStringPromise
}

function readQueryString() {
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

  return [fileID, fileHash]
}

export default function TestPage() {  
  let [fileID, fileHash] = readQueryString()

  return(
    <div>
      <div>File ID = {fileID}</div>
      <div>File Hash = {fileHash}</div>
    </div>
  )
}