import React from 'react';
import styles from "../styles/Home.module.css"
import Link from 'next/link'

const Header = (props) => {
	return (
		<div className={styles.imageHeader}>
			<Link href="/files">

				<img src="/logo.png" alt="my_Logo"></img>
			</Link>
			<div className={styles.helpMenu} >
				<button>?</button>
				<div className={styles.helpTip}> {props.helpText}
					Click the RemoteText Logo to return to the Files page.</div>
			</div>

		</div>
	);
};

export {Header};
