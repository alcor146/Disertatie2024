import { create } from 'ipfs-http-client';
import secrets from 'secrets.js-grempe';
import crypto from  'crypto';

import Web3 from 'web3';
import configuration from '../../../Truffle/build/contracts/FileManagement.json' assert { type: "json" };

const baseUrl = "http://localhost:3001/api/files";
const nodesAPI = [
  'http://localhost:5002',
  'http://localhost:5003',
  'http://localhost:5004'
]

const nodes = [];

for (let i=0; i<nodesAPI.length; i++){
  nodes.push(create({ url: nodesAPI[i]}));
}

var getHash = ( content ) => {				
  var hash = crypto.createHash('sha256');
  let data = hash.update(content);
  let gen_hash= data.digest('hex');
  return gen_hash;
}



const CONTRACT_ADDRESS = configuration.networks[12345].address
const CONTRACT_ABI = configuration.abi;

const web3 = new Web3(
  Web3.givenProvider || 'http://127.0.0.1:30304'
);
const contract = new web3.eth.Contract(
  CONTRACT_ABI,
  CONTRACT_ADDRESS
);

const accounts = await web3.eth.getAccounts()
let account = accounts[0];
console.log(account)



export const upload = async (req, res, next) => {
  console.log("body: ", req.body)

  if (!req.headers['content-type'] || !req.headers['content-type'].startsWith('multipart/form-data')) {
    return res.status(400).json({ error: 'Invalid content type. Use multipart/form-data.' });
  }

  let name = req.headers.filename;
  

  const chunks = [];
  
  // Listen for data chunks
  req.on('data', chunk => {
    chunks.push(chunk);
  });

  // When all data is received
  req.on('end', async () => {
    const dataBuffer = Buffer.concat(chunks);
    console.log("file3: ", dataBuffer)
    const HexData = dataBuffer.toString('hex');
    const shares = secrets.share(HexData, 3, 2); 
    const ipfsHashes = [];
    for (let i = 0; i < shares.length; i++) {
        const response = await nodes[i].add(shares[i]);
        const ipfsHash = response.cid.toString();
        ipfsHashes.push(ipfsHash);
        console.log(`Share ${i + 1} uploaded to IPFS with hash: ${ipfsHash}`);
    }

    let hash = getHash(dataBuffer)
    console.log("file: ", name)
    console.log("IPFS:", ipfsHashes);
    console.log("hash:",hash)

    const gas = 2000000;  // Adjust gas limit
    const gasPrice = 1000000000;  // Adjust gas price (wei)

    let result = await contract.methods.addFile(name, ipfsHashes, hash, account)
                  .send({ from: account, gas: gas, gasPrice: gasPrice });

    console.log('Transaction Hash:', result.transactionHash);


    res.json({ message: 'File received successfully' });
  });
};


export const getListFiles = async (req, res, next) => {
  
    let fileInfos = [];

    let files = await contract.methods.getFileNames().call({ from: account })
    console.log("files: ",files)

    files.forEach((file) => {
      fileInfos.push({
        name: file,
        url: baseUrl + file,
      });
    });

    res.status(200).json({success: true, message: 'GET /Carts Works!', data: fileInfos});
};

export const deleteFile = async (req, res, next) => {
  
  let fileName = req.body.name;

  const gas = 2000000;  // Adjust gas limit
  const gasPrice = 1000000000;  // Adjust gas price (wei)

  await contract.methods.removeFile(fileName)
    .send({ from: account, gas: gas, gasPrice: gasPrice });

  res.status(200).json({success: true, message: 'Delete /File Works!'});
};

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

export const download = async (req, res, next) => {
  const fileName = req.params.name;

  let file = await contract.methods.getFile(fileName).call({ from: account })

  const ipfsHashes = file.fileIpfsHashes[file.fileIpfsHashes.length-1];

  const shares = [];

    for (let i=0; i<nodes.length; i++){
      const share = await downloadShare(nodes[i], ipfsHashes[i]);
      shares.push(share);
    }
       
    if (shares.length >= 2) {
        const reconstructedHex4 = secrets.combine(shares); // Reconstruct the base64 encoded content
        const reconstructedData = Buffer.from(reconstructedHex4, 'hex');
        let hash = getHash(reconstructedData)
        if(hash != file.hashes[file.hashes.length-1])
          console.log("File Integrity compromised");
        else
          console.log("File is secure");
        
        console.log("original hash: ", file.hashes[file.hashes.length-1])  
        console.log("hash: ", hash)
        
        try {
          // Set the appropriate headers for the file download
          res.setHeader('Content-Type', 'application/octet-stream');
          res.setHeader('Content-Disposition', 'attachment; filename="downloadedFile.txt"');
      
          // Send the buffer data as the response
          res.send(reconstructedData);
        } catch (error) {
          console.error('Error handling download:', error);
          res.status(500).json({ error: 'Internal server error' });
        }
        console.log(`DOCX document successfully reconstructed and saved to Downloads folder `);
    } else {
        console.error('Insufficient shares for reconstruction.');
        res.status(401)
    }
};

