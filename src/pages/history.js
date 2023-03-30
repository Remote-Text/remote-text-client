import Head from 'next/head'
import Link from 'next/link'
import styles from '../styles/Home.module.css'
import RemoteTextApi from '../externalApis/remoteTextApi.js'
import React, {useState, useEffect} from "react"


import Tree from 'react-d3-tree';


const remoteTextApi = new RemoteTextApi();

function createHistoryTree(commitMap, refMap, parentToFind = null){
		
	var nextCommitHash = commitMap.get(parentToFind);

	if(!nextCommitHash){
		return;
	}

	var historyTree = {
		name: nextCommitHash
	}

	var ref = refMap.get(nextCommitHash)

	if(ref){
		historyTree.name = ref
	}


	historyTree.children =[ createHistoryTree(commitMap, refMap, nextCommitHash)]

	return historyTree
}



async function logGetHistory(){

	var hist = await remoteTextApi.getHistory("0".repeat(32))
	if(!hist){
		throw new Error
	}
	var commitMap = new Map();
	var refMap = new Map();

	for(let i = 0; i < hist.commits.length; i++){
		let commit = hist.commits[i]
		commitMap.set(commit.parent, commit.hash)
	}

	for(let i = 0; i < hist.refs.length; i++){
		let ref = hist.refs[i]
		refMap.set(ref.hash , ref.name)
	}

	
	return createHistoryTree(commitMap, refMap)
}


export default async function History() {
    const [historyTree, setHistoryTree] = useState([]);
    
    useEffect(  async () => { 
		var tree = await logGetHistory()
		console.log(tree)
		setHistoryTree({
  name: 'CEO',
  children: [
    {
      name: 'Manager',
      attributes: {
        department: 'Production',
      },
      children: [
        {
          name: 'Foreman',
          attributes: {
            department: 'Fabrication',
          },
          children: [
            {
              name: 'Worker',
            },
          ],
        },
        {
          name: 'Foreman',
          attributes: {
            department: 'Assembly',
          },
          children: [
            {
              name: 'Worker',
            },
          ],
        },
      ],
    },
  ],
})
    }, []);
	return (
		<>
			<Head>
				<title>Hello World</title>
			</Head>
	  <div id="historyTree" style={{ width: '50em', height: '20em' }}>
      <Tree data={historyTree} />
    </div>	
			<main className={styles.main}>
				<button id="getHistory" onClick={logGetHistory}>GetHistory</button>
				<Link id="goHome" href="/">Home</Link>
			</main>
		</>
	)

}
