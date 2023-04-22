import Head from 'next/head'
import Link from 'next/link'
import styles from '../styles/Home.module.css'
import React, { useEffect, useState } from "react"

// window.open(window.location.origin+"/error?err="+errorCode, "_self")

function goHome() {
    window.open(window.location.origin,"_self")
}

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

export default function Error() {
    const [errorCode, setErrorCode] = useState({})
    useEffect(() => {
        getQueryString()
        .then(data =>{
            const urlParams = new URLSearchParams(data)
            setErrorCode(urlParams.get('err'))
        })
    })

    var message = "Something went wrong!"

    if (errorCode == "404" ) { message = "Oops, we couldn't find that file." }
    else if (errorCode == "500") { message = "An internal server error occurred."}
    else if (errorCode == "503") { message = "The RemoteText server is down, please try again later."}
    else if (errorCode == "???" ) { message = "... ....... ???" }

    return ( <>
            <Head>
                <title>Error - RemoteText</title>
            </Head>
			<div id="404div">
				<pre>
	{	`		__ 
               / _) 
      _.----._/ / 
     /  error  / 
  __/ (  | (  | 
 /__.-'|_|--|_| `}
 				</pre>
                <p>{message}</p>
                <button onClick={goHome}>Return to home.</button>
			</div>
            </>
    )
}
