import Web3 from 'web3';
import configuration from '../../Truffle/build/contracts/FileManagement.json' assert { type: "json" };

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

const ipfsHashes = [
  'a',
  'b',
  'c'
];

console.log(account)


// try{
//     let result = await contract.methods.addFile("ghgh", ipfsHashes, "pere", account).call()
//   console.log("resukt: ", result)

// }catch(error){
//   console.error("Transaction failed:", error);
// }

// let all = await contract.methods.allFiles().call()
// console.log("all: ", all)

// let newFile = await contract.methods.addFile("ghghergregebrere", ipfsHashes, "pere", account).call()
// console.log("newFile: ", newFile)

// let all = await contract.methods.allFiles().call()
// console.log("all: ", all)

let fileNames = await contract.methods.getFileNames(account).call()
console.log("fileNames: ", fileNames)

// let result1 = await contract.methods.allFiles().call()
// console.log("result1: ", result1)




// result = await contract.methods.getFile("name1" ,account).call()
// console.log("fvfv: ", result)


