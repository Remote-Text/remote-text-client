import RemoteTextApi from '../externalApis/remoteTextApi.js'
import style from '../styles/historyTree.module.css'
import React, {useCallback, useState, useLayoutEffect} from "react"
import Link from 'next/link'
import Tree from 'react-d3-tree';

const remoteTextApi = new RemoteTextApi();


function createHistoryTree(commitMap, refMap, rootHash) {

	var historyTree = {
		name: rootHash.substring(0, 7),
		properties: {
			hash: rootHash
		}
	}

	var ref = refMap.get(rootHash)

	if (ref) {
		historyTree.attributes = {name: ref}
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

	let rootHash = commitMap.get(null)[0]
	let tree = createHistoryTree(commitMap, refMap, rootHash)

	let treePromise = new Promise((resolve) => {
		if (tree != undefined) {
			resolve(tree)
		}
	})
	return treePromise
}

// Here is how to extract the hash from pressing on a node
function logNode(event) {
	console.log(event.data.properties.hash)
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
	const textLayout = {attribute: {dy: "5em", x: 200000}};
	const nodeSize = {x: 200, y: 200};
	const [queryString, setQueryString] = useState("1".repeat(32))
	useLayoutEffect(() => {
		getQueryString()
			.then(data => {

				const urlParams = new URLSearchParams(data)
				const fileID = urlParams.get('id')
				getHistoryAndMakeTree(fileID)
					.then(tree => {
						setHistoryTree(tree)
					}

					)
			}
			)
	})
	// const foreignObjectProps = {width: nodeSize.x, height: nodeSize.y, x: 20};



	if (historyTree != null) {

		return (

			<div className={style.fullscreen} ref={containerRef} id="treeWrapper" >
				<Tree
					data={historyTree}
					translate={translate}
					draggable={true}
					onNodeClick={logNode}
					collapsible={false}
					rootNodeClassName={style.node__root}
					branchNodeClassName={style.node__branch}
					nodeSize={nodeSize}
					textLayout={textLayout}
					// renderCustomNodeElement={(rd3tProps) =>
					// 	renderForeignObjectNode({...rd3tProps, foreignObjectProps})
					// }
					leafNodeClassName={style.node__leaf} />
			</div>

		)
	} else {
		return (

			<div id="404div">

				<h1>Something went wrong! Please go home and try again</h1>
				<Link id="HomePageLink" href="/">Home</Link>
			</div>
		)
	}


}
