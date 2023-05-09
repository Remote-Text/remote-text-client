import Head from 'next/head'
import React, {useEffect, useState} from "react"


function goHome() {
	window.open(window.location.origin, "_self")
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
			.then(data => {
				const urlParams = new URLSearchParams(data)
				setErrorCode(urlParams.get('err'))
			})
	})

	var message = ""

	if (errorCode == "404") {message = "(404) Oops, we couldn't find that file."}
	else if (errorCode == "500") {message = "(500) An internal server error occurred."}
	else if (errorCode == "503") {message = "(503) The RemoteText server is down, please try again later."}
	else if (errorCode == "400") {message = "(400) Bad request: we couldn't find a version of this file with that hash."}
	else {message = "(" + errorCode + ") Oops, something went wrong."}

	return (<>
		<Head>
			<title>Error - RemoteText</title>
		</Head>
		<div id="404div">
			<pre>
				{`		__ 
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
