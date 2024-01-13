import fs from "fs";
const baseUrl = "http://localhost:3001/api/files";
import { create } from 'ipfs-http-client';
import secrets from 'secrets.js-grempe';
import Web3 from 'web3';
import configuration from '../../../Truffle/build/contracts/FileManagement.json' assert { type: "json" };

const nodesAPI = [
  'http://localhost:5002',
  'http://localhost:5003',
  'http://localhost:5004'
]

const nodes = [];

for (let i=0; i<nodesAPI.length; i++){
  nodes.push(create({ url: nodesAPI[i]}));
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

let files = contract.methods.getFileNames()
console.log("files ", files)

// console.log("aaaa: ", CONTRACT_ADDRESS)
// console.log("bbbb: ", CONTRACT_ABI)
// console.log("cccc: ", accounts)



export const upload = async (req, res, next) => {
  console.log("body: ", req.body)
  console.log("file: ", req.headers.filename)
  if (!req.headers['content-type'] || !req.headers['content-type'].startsWith('multipart/form-data')) {
    return res.status(400).json({ error: 'Invalid content type. Use multipart/form-data.' });
  }

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
    console.log(ipfsHashes);

    res.json({ message: 'File received successfully' });
  });
};


export const getListFiles = (req, res, next) => {
  // const directoryPath = "resources/";
  // console.log(directoryPath)
  // fs.readdir(directoryPath, function (err, files) {
  //   if (err) {
  //     res.status(500).send({
  //       message: "Unable to scan files!",
  //     });
  //   }
  //   let fileInfos = [];
  //   files.forEach((file) => {
  //     fileInfos.push({
  //       name: file,
  //       url: baseUrl + file,
  //     });
  //   });
  //   res.status(200).json({success: true, message: 'GET /Carts Works!', data: fileInfos});
  //});


  res.status(200)


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

  const shares = [];

  const ipfsHashes = [
    'QmW2PyjsxDQZrsgW7jijPxMGP6pWpnz2bVdLj2MbTS2ZFU',
    'QmSmTGUvxEQsga7NSA35cxq7XjoyqyJenwajvdBAooDJp9',
    'QmW68Yj7Z8PGZn9ZtbDpC2gVfyFdBsxdRpefobZYjiWjBJ'
  ];

    for (let i=0; i<nodes.length; i++){
      const share = await downloadShare(nodes[i], ipfsHashes[i]);
      shares.push(share);
    }
       
    if (shares.length >= 2) {
        const reconstructedHex4 = secrets.combine(shares); // Reconstruct the base64 encoded content
        const reconstructedData = Buffer.from(reconstructedHex4, 'hex');
        
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
        console.log(`DOCX document successfully reconstructed and saved to `);
    } else {
        console.error('Insufficient shares for reconstruction.');
        res.status(401)
    }
};

