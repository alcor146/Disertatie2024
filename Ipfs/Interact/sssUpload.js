import { create } from 'ipfs-http-client';
import secrets from 'secrets.js-grempe';
import fs from 'fs';
import { readFileSync } from 'fs';

const nodesAPI = [
    'http://localhost:5002',
    'http://localhost:5003',
    'http://localhost:5004'
  ]
  
  const nodes = [];
  
  for (let i=0; i<nodesAPI.length; i++){
    nodes.push(create({ url: nodesAPI[i]}));
  }

  
async function uploadShares(shares) {
    const ipfsHashes = [];
    for (let i = 0; i < shares.length; i++) {
        const response = await nodes[i].add(shares[i]);
        const ipfsHash = response.cid.toString();
        ipfsHashes.push(ipfsHash);
        console.log(`Share ${i + 1} uploaded to IPFS with hash: ${ipfsHash}`);
    }
    console.log(ipfsHashes);
}

const filePath = 'ReferatTest.pdf'; // Replace with the path to your DOCX file
const data = readFileSync(filePath); // Read the DOCX file as a buffer
const HexData = data.toString('hex');
const shares = secrets.share(HexData, 3, 2); // Split the base64 encoded content into 3 shares, require 2 for reconstruction

uploadShares(shares);


