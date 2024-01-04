import { create } from 'ipfs-http-client';
import secrets from 'secrets.js-grempe';
import fs from 'fs';


const nodesAPI = [
  'http://localhost:5002',
  'http://localhost:5003',
  'http://localhost:5004'
]

const nodes = [];

for (let i=0; i<nodesAPI.length; i++){
  nodes.push(create({ url: nodesAPI[i]}));
}

const ipfsHashes = [
  'QmTzH5oLSfKqVnVNMoxFLUXmJmRC4yQZ711bJiGC8x7iZm',
  'QmWUgfTnVuDsXH4yNHfctvRu9dEwZ4N7LEDD5EhWig2A6m',
  'QmcphoT92SZHnqDttrVTnhTjhra1cJyjSM2WYHTKqrZDUf'
];

async function downloadShare(ipfs, hash) {
  try {
      const chunks = [];
      for await (const chunk of ipfs.cat(hash)) {
          chunks.push(chunk);
      }
      return Buffer.concat(chunks).toString('utf8');
  } catch (error) {
      console.error(`Error downloading file `, error);
      return null;
  }
}

async function reconstructSecret() {
    const shares = [];

    for (let i=0; i<nodes.length; i++){
      const share = await downloadShare(nodes[i], ipfsHashes[i]);
      shares.push(share);
    }
       
    if (shares.length >= 2) {
        const outputFilePath = 'ReconstructedFile.pdf';
        const reconstructedHex4 = secrets.combine(shares); // Reconstruct the base64 encoded content
        const reconstructedData = Buffer.from(reconstructedHex4, 'hex');
        fs.writeFileSync(outputFilePath, reconstructedData);
        console.log(`DOCX document successfully reconstructed and saved to ${outputFilePath}`);
    } else {
        console.error('Insufficient shares for reconstruction.');
    }
}

reconstructSecret();
