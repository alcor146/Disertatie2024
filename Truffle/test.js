const Web3 = require('web3');
const web3 = new Web3('http://localhost:8545'); // Replace with your private network URL
const { abi, evm } = require('./ShamirSecretSharing.json'); // Replace with your contract ABI and bytecode
const nodeAddresses = ['0xAddress1', '0xAddress2', '0xAddress3']; // Add the addresses of your nodes

async function deployContract() {
  try {
    for (const address of nodeAddresses) {
      const accounts = await web3.eth.getAccounts();
      const sender = accounts[0]; // Use your sender account here

      console.log(`Deploying contract to node at address: ${address}`);

      const contract = new web3.eth.Contract(abi);

      const deploy = contract.deploy({
        data: '0x' + evm.bytecode.object,
      });

      const gas = await deploy.estimateGas();

      const newContractInstance = await deploy.send({
        from: sender,
        gas,
        gasPrice: '20000000000', // Adjust the gas price as needed
      });

      console.log(`Contract deployed to: ${newContractInstance.options.address}`);
    }
  } catch (error) {
    console.error('Error deploying contract:', error);
  }
}

deployContract();
