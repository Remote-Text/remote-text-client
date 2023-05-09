import RemoteTextApi from '../externalApis/remoteTextApi.js'
import styles from "../styles/Home.module.css"
import {Header} from '../components/Header';
import React, {useCallback, useState, useLayoutEffect} from "react"
import Head from "next/head"
import Tree from 'react-d3-tree';

const remoteTextApi = new RemoteTextApi();
var fileID
var fileName

// commitToChildMap : dictionary of <parent hash>:[<child hash>]
// refMap : dictionary of <hash>:<string>
// rootHash : hash <string>
function createHistoryTree(commitToChildMap, refMap, rootHash) {

	// add the hash to the attributes
	var historyTree = {
		name: rootHash.substring(0, 7),
		properties: {
			hash: rootHash
		}
	}

	var ref = refMap.get(rootHash)

	// add name if one exists
	if (ref) {
		historyTree.attributes = {name: ref}
	}


	// if there is children, get them too
	let children = commitToChildMap.get(rootHash)
	if (children) {
		historyTree.children = []
		for (let i = 0; i < children.length; i++) {
			historyTree.children.push(createHistoryTree(commitToChildMap, refMap, children[i]))
		}
	}
	return historyTree
}



// gets the history from the api, then puts the information into Maps to be processed into history tree
async function getHistoryAndMakeTree(id) {
	if (!id) {
		return null
	}
	var hist = await remoteTextApi.getHistory(id)

	// if call fails, go to 404
	if (!hist) {
		return null
	}

	// throw the info from the api into maps to make it searchable
	var commitMap = new Map();
	var refMap = new Map();

	for (let i = 0; i < hist.commits.length; i++) {
		let commit = hist.commits[i]
		let current = commitMap.get(commit.parent)
		if (current) {
			current.push(commit.hash)
			commitMap.set(commit.parent, current)
		} else {
			commitMap.set(commit.parent, [commit.hash])
		}
	}

	for (let i = 0; i < hist.refs.length; i++) {
		let ref = hist.refs[i]
		refMap.set(ref.hash, ref.name)
	}

	// the commit with the parent "null" should be the root of the tree
	let hashes = commitMap.get(null)
	if (!hashes) {
		return null
	}

	let rootHash = hashes[0]
	let tree = createHistoryTree(commitMap, refMap, rootHash)

	// make sure tree is returned
	let treePromise = new Promise((resolve) => {
		if (tree != undefined) {
			resolve(tree)
		}
	})
	return treePromise
}

// Here is how to extract the hash from pressing on a node
function openNodeFile(event) {
	let hash = event.data.properties.hash
	let branchName = ""
	if (event.data.hasOwnProperty("attributes")) {
		branchName = event.data.attributes.name
	} else {
		branchName = event.data.name
	}
	window.open(document.location.origin + "/editor?id=" + fileID + "&name=" + fileName + "&hash=" + hash + "&branch=" + branchName)
}

// centers the history tree
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

// extracts url parameters
async function getQueryString() {
	let queryString = window.location.search
	let queryStringPromise = new Promise((resolve) => {
		if (queryString != undefined) {
			resolve(queryString)
		}
	})
	return queryStringPromise
}

// should show a tree which has the git history of the file
export default function HistoryPage() {
	const [historyTree, setHistoryTree] = useState({});
	const [translate, containerRef] = useCenteredTree();
	const nodeSize = {x: 200, y: 200};

	// this extracts file information from the URL
	useLayoutEffect(() => {
		getQueryString()
			.then(data => {

				const urlParams = new URLSearchParams(data)
				fileID = urlParams.get('id')
				fileName = urlParams.get('name')
				getHistoryAndMakeTree(fileID)
					.then(tree => {
						setHistoryTree(tree)
					}

					)
			}
			)
	}, [])

	return (<>
		<Head>
			<title>{fileName} - History</title>
		</Head>
		<main>
			<Header helpText="The tree below represents the history of this file. The nodes are versions of the file, and the numbers are the hashes of that file version. The names are the branch names. To edit a version of the file, just click on the node that represents that version. " />
			<div className={styles.fullscreen} ref={containerRef} id="treeWrapper" >
				<Tree
					rd3t-label_title={styles.rd3t_label_title}
					data={historyTree}
					translate={translate}
					draggable={true}
					onNodeClick={openNodeFile}
					collapsible={false}
					rootNodeClassName={styles.node__root}
					branchNodeClassName={styles.node__branch}
					pathClassFunc={styles.node_link}
					nodeSize={nodeSize}
					textLayout={styles.node_text}
					leafNodeClassName={styles.node__leaf} />
			</div>
		</main>
	</>)
}
