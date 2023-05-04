import React from 'react';
import styles from "../styles/Home.module.css"

const Header = () => {
	return (
		<div className={styles.imageHeader}>
			<img src="/logo.png" alt="my_Logo"></img>
		</div>
	);
};

export {Header};
