/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const fs = require('fs');
const path = require('path');

const networkRoot = path.resolve(__dirname, '..', '..', 'network');
const defaultChannel = process.env.CHANNEL_NAME || 'mychannel';

function readPemIfExists(filePath) {
	if (!fs.existsSync(filePath)) {
		return null;
	}
	return fs.readFileSync(filePath, 'utf8');
}

/**
 * Generated connection profiles omit channels/orderers (relying on discovery).
 * When discovery is off, the Node SDK needs static channel peer + orderer endpoints.
 */
function loadRawCCP(orgNum) {
	const file =
		orgNum === 1
			? 'organizations/peerOrganizations/org1.example.com/connection-org1.json'
			: 'organizations/peerOrganizations/org2.example.com/connection-org2.json';
	const ccpPath = path.join(networkRoot, file);
	return JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
}

function enrichCCP(ccp, orgNum) {
	const ordererTlsPath = path.join(
		networkRoot,
		'organizations/ordererOrganizations/example.com/orderers/orderer.example.com/tls/ca.crt'
	);
	const ordererPem = readPemIfExists(ordererTlsPath);

	if (!ccp.channels) {
		ccp.channels = {};
	}
	if (!ccp.channels[defaultChannel]) {
		ccp.channels[defaultChannel] = {
			orderers: ['orderer.example.com'],
			peers: {},
		};
	}

	// Default lifecycle policy on a 2-org channel needs both peers to endorse.
	for (const n of [1, 2]) {
		const peerName = `peer0.org${n}.example.com`;
		if (!ccp.peers[peerName]) {
			ccp.peers[peerName] = loadRawCCP(n).peers[peerName];
		}
		ccp.channels[defaultChannel].peers[peerName] = {
			endorsingPeer: true,
			chaincodeQuery: true,
			ledgerQuery: true,
			eventSource: true,
		};
	}

	if (ordererPem) {
		if (!ccp.orderers) {
			ccp.orderers = {};
		}
		if (!ccp.orderers['orderer.example.com']) {
			ccp.orderers['orderer.example.com'] = {
				url: 'grpcs://localhost:7050',
				tlsCACerts: { pem: ordererPem },
				grpcOptions: {
					'ssl-target-name-override': 'orderer.example.com',
					hostnameOverride: 'orderer.example.com',
				},
			};
		}
	}

	return ccp;
}

function loadCCP(relativePath) {
	const ccpPath = path.join(networkRoot, relativePath);
	if (!fs.existsSync(ccpPath)) {
		throw new Error(`no such file or directory: ${ccpPath}`);
	}
	const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
	console.log(`Loaded the network configuration located at ${ccpPath}`);
	return ccp;
}

exports.buildCCPOrg1 = () =>
	enrichCCP(
		loadCCP(
			'organizations/peerOrganizations/org1.example.com/connection-org1.json'
		),
		1
	);

exports.buildCCPOrg2 = () =>
	enrichCCP(
		loadCCP(
			'organizations/peerOrganizations/org2.example.com/connection-org2.json'
		),
		2
	);

exports.buildWallet = async (Wallets, walletPath) => {
	// Create a new  wallet : Note that wallet is for managing identities.
	let wallet;
	if (walletPath) {
		wallet = await Wallets.newFileSystemWallet(walletPath);
		console.log(`Built a file system wallet at ${walletPath}`);
	} else {
		wallet = await Wallets.newInMemoryWallet();
		console.log('Built an in memory wallet');
	}

	return wallet;
};

exports.prettyJSONString = (inputString) => {
	if (inputString) {
		 return JSON.stringify(JSON.parse(inputString), null, 2);
	}
	else {
		 return inputString;
	}
}
