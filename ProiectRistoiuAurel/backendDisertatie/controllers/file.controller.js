import { create } from 'ipfs-http-client';
import secrets from 'secrets.js-grempe';
import crypto from  'crypto';

import Web3 from 'web3';
import configuration from '../../../Truffle/build/contracts/FileManagement.json' assert { type: "json" };
import multer from 'multer';
const uploadFile = multer();

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

const gas = 2000000;  // Adjust gas limit
const gasPrice = 1000000000;  // Adjust gas price (wei)
let currentAccount = "0x568f2D6eB23cbF65D56cC004f9CDB26AEfbCf244"


    
  



    //console.log("Account: ", await contract.methods.getAccount("Admin").call())

const initialize = async () => {
  try{
    let account1 = await contract.methods.createAccount("Admin", "0x568f2D6eB23cbF65D56cC004f9CDB26AEfbCf244", "key1")
    .send({ from: currentAccount, gas: gas, gasPrice: gasPrice });
    console.log("created account1: ", account1)
    let account2 = await contract.methods.createAccount("Aurel Ristoiu", "0x510F0A55f962EB67dAa8a20553fa897157466f9F", "key2")
    .send({ from: currentAccount, gas: gas, gasPrice: gasPrice });
    console.log("created account2: ", account2)
    let account3 = await contract.methods.createAccount("George Ristoiu", "0xE2C17ef972951095173d2470d9CD34449F3D4B09", "key3")
    .send({ from: currentAccount, gas: gas, gasPrice: gasPrice });
    console.log("created account3: ", account3)

    let accountList =await contract.methods.getAccounts().call()
    console.log(accountList)
  }catch(error){
    console.log("Create ERROR: ", error.message)
    let accountList =await contract.methods.getAccounts().call()
    console.log(accountList)
  }
}

//initialize()

//   console.log(await contract.methods.deleteAccount("Aurel Ristoiu")
//     .send({ from: currentAccount, gas: gas, gasPrice: gasPrice }));

console.log("Accounts: ", await contract.methods.getAccounts().call())

//console.log("Accounts: ", await contract.methods.getAccountsInfo().call())


function getTimestamp () {
  const pad = (n,s=2) => (`${new Array(s).fill(0)}${n}`).slice(-s);
  const d = new Date();
  
  return `${pad(d.getFullYear(),4)}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

export const createAccount = async (req, res, next) => {

  let accountName = req.body.body.account
  console.log(req.body.body.account)
  let currentAccount = req.body.body.currentAccount
  console.log(req.body.body.currentAccount)

  const newAccount = web3.eth.accounts.create();
  console.log(newAccount)
  console.log(newAccount.privateKey.toString('hex'))

  const gas = 2000000;  // Adjust gas limit
  const gasPrice = 1000000000;  // Adjust gas price (wei)
  let account 
  try {
    account = await contract.methods.createAccount(accountName, newAccount.address, newAccount.privateKey)
    .send({ from: currentAccount, gas: gas, gasPrice: gasPrice });
    console.log(account)
    let accountList =await contract.methods.getAccounts().call()
    console.log(accountList)

    res.status(200).json({success: true, message: 'Create Accounts Works!', key: newAccount.privateKey});
} catch (error) {
    console.log("ERROR: ", error.message)
    let accountList =await contract.methods.getAccounts().call()
    console.log(accountList)
    res.status(200).json({success: false, message: 'Account already exists'});
}


  

};

export const deleteAccount = async (req, res, next) => {

  let accountName = req.body.body.account
  let currentAccount = req.body.body.currentAccount
  console.log(accountName)
  console.log(currentAccount)

  const gas = 2000000;  // Adjust gas limit
  const gasPrice = 1000000000;  // Adjust gas price (wei)
   
  try {
    console.log(await contract.methods.deleteAccount(accountName)
    .send({ from: currentAccount, gas: gas, gasPrice: gasPrice}));

    res.status(200).json({success: true, message: `Delete Accounts Works ${accountName}!`});
} catch (error) {
    console.log("ERROR: ", error.message)
    res.status(200).json({success: false, message: 'Account doesn t exists'});
}

// let accountList =await contract.methods.getAccounts().call()
//     console.log(accountList)
  
};

export const listAccounts = async (req, res, next) => {


  let currentAccount = req.body.body.currentAccount

  const gas = 2000000;  // Adjust gas limit
  const gasPrice = 1000000000;  // Adjust gas price (wei)
  let accounts 
  try {
    accounts = await contract.methods.getAccountsInfo().call()

    res.status(200).json({success: true, message: 'Accounts List Works!', accounts});
} catch (error) {
    console.log("ERROR: ", error.message)
    res.status(200).json({success: false, message: 'Account doesn t exists'});
}


  
};

export const upload = async (req, res, next) => {

  uploadFile.single('file')(req, res, async (err) => {
    if (err) {
      console.error('Error parsing form data:', err);
      return;
    }
  
    const fileData = req.file.buffer; // File data
    console.log("filedata: ",fileData)
    const fileName = req.headers.filename; // Filename from headers
    console.log("filename: ", fileName)
    let account = req.headers.currentaccount
    console.log("headers: ", req.headers)

    const HexData = fileData.toString('hex');
    const shares = secrets.share(HexData, 3, 2); 
    const ipfsHashes = [];
    for (let i = 0; i < shares.length; i++) {
        const response = await nodes[i].add(shares[i]);
        const ipfsHash = response.cid.toString();
        ipfsHashes.push(ipfsHash);
        console.log(`Share ${i + 1} uploaded to IPFS with hash: ${ipfsHash}`);
    }

    let hash = getHash(fileData)
    console.log("file: ", fileName)
    console.log("IPFS:", ipfsHashes);
    console.log("hash:",hash)

    const gas = 2000000;  // Adjust gas limit
    const gasPrice = 1000000000;  // Adjust gas price (wei)

    let timestamp = getTimestamp();

    let result = await contract.methods.addFile(fileName, ipfsHashes, hash, timestamp)
                  .send({ from: account, gas: gas, gasPrice: gasPrice });

    console.log('Transaction Hash:', result.transactionHash);

  res.json({ message: 'File received successfully' });
   });
};

export const getListFiles = async (req, res, next) => {
  
    let fileInfos = [];

    let account = req.headers.currentaccount
    console.log("account: ", account)
    let files;
    if(account == "0x568f2d6eb23cbf65d56cc004f9cdb26aefbcf244") {
      files = await contract.methods.getAllFiles().call({ from: account })
      console.log("files1: ",files)
    }
    else {
      files = await contract.methods.getFiles().call({ from: account })
      console.log("files2: ",files)
    }
     

    files.forEach((file) => {
      fileInfos.push({
        name: file.name,
        owner: file.owner,
        timestamps: file.timestamps,
        selectedTimestamp: file.timestamps[file.timestamps.length - 1],
        url: baseUrl + file,
      });
    });

    console.log(fileInfos)

    res.status(200).json({success: true, message: 'GET /Carts Works!', data: fileInfos});
};

export const deleteFile = async (req, res, next) => {
  
  let fileName = req.body.name;
  let currentAccount = req.body.currentAccount
  console.log(req.body)
  console.log("fileName: ", fileName);
  console.log("account: ", currentAccount);

  const gas = 2000000;  // Adjust gas limit
  const gasPrice = 1000000000;  // Adjust gas price (wei)

  await contract.methods.removeFile(fileName)
    .send({ from: currentAccount, gas: gas, gasPrice: gasPrice });

  res.status(200).json({success: true, message: 'Delete /File Works!'});
};

export const shareFile = async (req, res, next) => {
  
  let fileName = req.body.body.name;
  let account = req.body.body.account.toLowerCase();
  let currentAccount = req.body.body.currentAccount;
  console.log("fileName: ", fileName);
  console.log("account: ", account);
  console.log("currentAccount: ", currentAccount);

  const gas = 2000000;  // Adjust gas limit
  const gasPrice = 1000000000;  // Adjust gas price (wei)

  await contract.methods.shareAccessToFile(fileName, account)
    .send({ from: currentAccount, gas: gas, gasPrice: gasPrice });

  res.status(200).json({success: true, message: 'Share /File Works!'});
};

export const denyFile = async (req, res, next) => {
  
  let fileName = req.body.body.name;
  let account = req.body.body.account.toLowerCase();
  let currentAccount = req.body.body.currentAccount;
  console.log("fileName: ", fileName);
  console.log("account: ", account);
  console.log("currentAccount: ", currentAccount);

  const gas = 2000000;  // Adjust gas limit
  const gasPrice = 1000000000;  // Adjust gas price (wei)

  await contract.methods.revokeAccessToFile(fileName, account)
    .send({ from: currentAccount, gas: gas, gasPrice: gasPrice });

  res.status(200).json({success: true, message: 'Deny /File Works!'});
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

  let account = req.headers.currentaccount
  let timestamp = req.headers.currentversion
  console.log("currentaccount: ", account)
  console.log("currentversion: ", timestamp)


  let file = await contract.methods.getFile(fileName).call({ from: account })

  let ipfsHashes;

  for (let i=0; i<file.timestamps.length; i++){
    if(timestamp == file.timestamps[i])
      ipfsHashes = file.fileIpfsHashes[i]
  }

  console.log("IPFS FOR SPECIFIC VERSION:" ,ipfsHashes)

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

