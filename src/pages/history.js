import RemoteTextApi from '../externalApis/remoteTextApi.js'
import styles from "../styles/Home.module.css"
import React, { useCallback, useState, useLayoutEffect } from "react"
import Head from "next/head"
import Link from 'next/link'
import Tree from 'react-d3-tree';
import "../styles/historyTree.module.css"

const remoteTextApi = new RemoteTextApi();
var fileID
var fileName


function createHistoryTree(commitMap, refMap, rootHash) {

	var historyTree = {
		name: rootHash.substring(0, 7),
		properties: {
			hash: rootHash
		}
	}

	var ref = refMap.get(rootHash)

	if (ref) {
		historyTree.attributes = { name: ref }
	}


	// if there is children, get them too
	let children = commitMap.get(rootHash)
	if (children) {
		historyTree.children = []
		for (let i = 0; i < children.length; i++) {
			historyTree.children.push(createHistoryTree(commitMap, refMap, children[i]))
		}

	}
	return historyTree
}



async function getHistoryAndMakeTree(id) {
	if (!id) {
		return null
	}
	var hist = await remoteTextApi.getHistory(id)

	// if call fails, go to 404
	if (!hist) {
		return null
	}

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

	let hashes = commitMap.get(null)
	if (!hashes) {
		return null
	}
	let rootHash = hashes[0]
	let tree = createHistoryTree(commitMap, refMap, rootHash)

	let treePromise = new Promise((resolve) => {
		if (tree != undefined) {
			resolve(tree)
		}
	})
	return treePromise
}

// Here is how to extract the hash from pressing on a node
function openNodeFile(event) {  // debug note from Alan: I wasn't sure how to pass the ID to this function & couldn't trace back where event is being given to it, so I just made fileID global. Maybe not best practice, but it works.
	let hash = event.data.properties.hash
	let branchName = ""
	if (event.data.hasOwnProperty("attributes")) {
		branchName = event.data.attributes.name
	} else {
		branchName = event.data.name
	}
	window.open(document.location.origin+"/editor?id="+fileID+"&name="+fileName+"&hash="+hash+"&branch="+branchName)
      // to open in same window, add "_self" parameter. removed this do people can jump to a different branch more easily.
}

// a way to have prettier node names
// to implement later
// const renderForeignObjectNode = ({
// 	nodeDatum,
// 	foreignObjectProps
// }) => (
// 	<g>
// 		<circle r={30}></circle>
// 		{/* `foreignObject` requires width & height to be explicitly set. */}
// 		<foreignObject {...foreignObjectProps}>
// 			<div style={{x: 200, dy: "2em", border: "1px solid black", backgroundColor: "#dedede"}}>
// 				<h3 style={{textAlign: "center"}}>{nodeDatum.name}</h3>
// 			</div>
// 		</foreignObject>
// 	</g>
// );

// centers the tree
export const useCenteredTree = (defaultTranslate = { x: 0, y: 0 }) => {
	const [translate, setTranslate] = useState(defaultTranslate);
	const containerRef = useCallback((containerElem) => {
		if (containerElem !== null) {
			const { width, height } = containerElem.getBoundingClientRect();
			setTranslate({ x: width / 2, y: height / 2 });
		}
	}, []);
	return [translate, containerRef];
};

async function getQueryString() {
	let queryString = window.location.search
	let queryStringPromise = new Promise((resolve) => {
		if (queryString != undefined) {
			resolve(queryString)
		}
	})
	return queryStringPromise
}

export default function HistoryPage() {
	const [historyTree, setHistoryTree] = useState({});
	const [translate, containerRef] = useCenteredTree();
	const textLayout = { attribute: { dy: "5em", x: 200000 } };
	const nodeSize = { x: 200, y: 200 };
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
	// const foreignObjectProps = {width: nodeSize.x, height: nodeSize.y, x: 20};


	if (historyTree != null) {
  
		return ( <>
      <Head>
        <title>{fileName} - History</title>
      </Head>
			<div>
				<div className={styles.imageHeader}>
					<img src="/logo.png" alt="my_Logo"></img>
				</div>
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
						// renderCustomNodeElement={(rd3tProps) =>
						// 	renderForeignObjectNode({...rd3tProps, foreignObjectProps})
						// }
						leafNodeClassName={styles.node__leaf} />
				</div>
			</div>
	  </> )
    
	} else {
		window.open(window.location.origin+"/error","_self")
	}
}
