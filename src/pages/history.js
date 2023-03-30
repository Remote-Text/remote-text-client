import RemoteTextApi from '../externalApis/remoteTextApi.js'
import styles from '../styles/Home.module.css'
import React, {useCallback, useState, useEffect} from "react"
import Tree from 'react-d3-tree';

const remoteTextApi = new RemoteTextApi();

export const useCenteredTree = (defaultTranslate = {x: 0, y: 0}) => {
	const [translate, setTranslate] = useState(defaultTranslate);
	const containerRef = useCallback((containerElem) => {
		if (containerElem !== null) {
			const {width, height} = containerElem.getBoundingClientRect();
			setTranslate({x: width / 2, y: height / 2});
		}
	}, []);
	return [translate, containerRef];
};

function createHistoryTree(commitMap, refMap, parentToFind = null) {

	var nextCommitHash = commitMap.get(parentToFind);

	if (!nextCommitHash) {
		return;
	}

	var historyTree = {
		name: nextCommitHash.substring(0, 8)
	}

	var ref = refMap.get(nextCommitHash)

	if (ref) {
		historyTree.attributes = {name: ref}
	}


	if (commitMap.get(nextCommitHash)) {
		historyTree.children = [createHistoryTree(commitMap, refMap, nextCommitHash)]
	}

	return historyTree
}



async function logGetHistory() {

	var hist = await remoteTextApi.getHistory("0".repeat(32))
	if (!hist) {
		throw new Error
	}
	var commitMap = new Map();
	var refMap = new Map();

	for (let i = 0; i < hist.commits.length; i++) {
		let commit = hist.commits[i]
		commitMap.set(commit.parent, commit.hash)
	}

	for (let i = 0; i < hist.refs.length; i++) {
		let ref = hist.refs[i]
		refMap.set(ref.hash, ref.name)
	}

	let tree = createHistoryTree(commitMap, refMap)
	let treePromise = new Promise((resolve) => {
		if (tree != undefined) {
			resolve(tree)
		}
	})
	return treePromise
}

function logNode(event){
	console.log(event.data.name)
}

export default function History() {
	const [historyTree, setHistoryTree] = useState({name: "foo"});
	const [translate, containerRef] = useCenteredTree();

	useEffect(() => {
		logGetHistory()
			.then(tree => {
				setHistoryTree(tree)
			}

			)
	}, [])  

	return (

		<div className={styles.fullscreen} ref={containerRef} id="treeWrapper" >
			<Tree
				data={historyTree}
				translate={translate}
				draggable={true}
				onNodeClick={logNode}
				collapsible={false}
			/>
		</div>

	)

}
