import React from 'react';
import styles from "../styles/Home.module.css"
import Link from 'next/link'

const Header = () => {
	return (
		<div className={styles.imageHeader}>
			<Link href="/files">

				<img src="/logo.png" alt="my_Logo"></img>
			</Link>
			<div class={styles.helpMenu} >
				<button>?</button>
			</div>

		</div>
	);
};

export {Header};
