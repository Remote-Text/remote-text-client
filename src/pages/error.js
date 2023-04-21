import Head from 'next/head'
import Link from 'next/link'
import styles from '../styles/Home.module.css'

function goHome() {
    window.open(window.location.origin,"_self")
}

export default function Error() {
    return (
			<div id="404div">
				<pre>
	{	`		__ 
               / _) 
      _.----._/ / 
     /  error  / 
  __/ (  | (  | 
 /__.-'|_|--|_| `}
 				</pre>
                <p>Something went wrong!</p>
                <button onClick={goHome}>Return to home.</button>
			</div>
    )
}
