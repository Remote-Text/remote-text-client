import RemoteTextApi from '../externalApis/remoteTextApi.js'
import style from '../styles/historyTree.module.css'
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



async function getHistoryAndMakeTree() {
	var hist = await remoteTextApi.getHistory("9bc0e1fd-253c-4c50-b3d1-7c464c3b49d5")
	if (!hist) {

		throw new Error
	}

	// remove this 
	hist = testobj
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

function logNode(event) {
	console.log(event.data.properties.hash)
}
const renderForeignObjectNode = ({
	nodeDatum,
	foreignObjectProps
}) => (
	<g>
		<circle r={30}></circle>
		{/* `foreignObject` requires width & height to be explicitly set. */}
		<foreignObject {...foreignObjectProps}>
			<div style={{x: 200, dy: "2em", border: "1px solid black", backgroundColor: "#dedede"}}>
				<h3 style={{textAlign: "center"}}>{nodeDatum.name}</h3>
			</div>
		</foreignObject>
	</g>
);

let testobj = {
	"commits": [
		{
			"hash": "aceaaec23664ae26d76ab66cedfb1206b9c972b1",
			"parent": null
		},
		{
			"hash": "7c570dce251232eecd2daa6bd81723ef0a1a7590",
			"parent": "aceaaec23664ae26d76ab66cedfb1206b9c972b1"
		},
		{
			"hash": "7ce70dce251232eecd2daa6bd81723ef0a1a7591",
			"parent": "7c570dce251232eecd2daa6bd81723ef0a1a7590"
		},
		{
			"hash": "8c570dce251232eecd2daa6bd81723ef0a1a7590",
			"parent": "aceaaec23664ae26d76ab66cedfb1206b9c972b1"
		}
	],
	"refs": [
		{
			"name": "main",
			"hash": "7c570dce251232eecd2daa6bd81723ef0a1a7590"
		}
	]
}
export default function HistoryPage() {
	const [historyTree, setHistoryTree] = useState(testobj);
	const [translate, containerRef] = useCenteredTree();
	const textLayout = {attribute: {dy: "5em", x: 200000}};
	const nodeSize = {x: 200, y: 200};
	const foreignObjectProps = {width: nodeSize.x, height: nodeSize.y, x: 20};

	useEffect(() => {
		getHistoryAndMakeTree()
			.then(tree => {
				setHistoryTree(tree)
			}

			)
	}, [])

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

}
