

import Web3 from 'web3';
import configuration from '../../Truffle/build/contracts/FileManagement.json' assert { type: "json" };

const baseUrl = "http://localhost:3001/api/files";
const nodesAPI = [
  'http://localhost:5002',
  'http://localhost:5003',
  'http://localhost:5004'
]

const CONTRACT_ADDRESS = configuration.networks[12345].address
const CONTRACT_ABI = configuration.abi;

const web3 = new Web3(
  Web3.givenProvider || 'http://127.0.0.1:30304'
);
const contract = new web3.eth.Contract(
  CONTRACT_ABI,
  CONTRACT_ADDRESS
);

// const accounts = await web3.eth.getAccounts()
// console.log(accounts)



// let account = accounts[0];
let files = await contract.methods.getAccounts().call()
    console.log("files: ",files)



