pragma solidity ^0.8.13;
//import "hardhat/console.sol";
// SPDX-License-Identifier: MIT

contract FileManagement {

    struct File {
        string name;
        string[][] fileIpfsHashes; // Matrix to store three IPFS hashes for each version
        string[] hashes;
        address owner;
        string[] timestamps;
    }

    struct Account{
        string name;
        address accountAddress;
        string privateKey;
        bool exists;
    }
    

    File[] public files;
    mapping(address => mapping(string => uint)) private ownerFileIndexes;
    mapping(string => Account) private accounts;
    string [] private accountNames;


    function getFileNames() public view returns (string[] memory) {
         uint256 fileCount = files.length;

        // Temporary array to store filtered file names
        string[] memory ownerFiles = new string[](fileCount);
        uint256 ownerFileCount = 0;

        for (uint256 i = 0; i < fileCount; i++) {
            // Check if the file belongs to the specified owner
            if (ownerFileIndexes[msg.sender][files[i].name] > 0) {
                ownerFiles[ownerFileCount] = files[i].name;
                ownerFileCount++;
            }
        }

        // Create a new array with the correct size to store only the owner's files
        string[] memory result = new string[](ownerFileCount);
        for (uint256 j = 0; j < ownerFileCount; j++) {
            result[j] = ownerFiles[j];
        }

        return result;
    }

    function getFiles() public view returns (File[] memory) {
         uint256 fileCount = files.length;

        File[] memory ownerFiles = new File[](fileCount);
        uint256 ownerFileCount = 0;

        for (uint256 i = 0; i < fileCount; i++) {
            if (ownerFileIndexes[msg.sender][files[i].name] > 0) {
                ownerFiles[ownerFileCount] = files[i];
                ownerFileCount++;
            }
        }

        File[] memory result = new File[](ownerFileCount);
        for (uint256 j = 0; j < ownerFileCount; j++) {
            result[j] = ownerFiles[j];
        }

        return result;
    }

    function getAllFiles() public view returns (File[] memory) {
        return files;
    }

    
    function getFile(string memory name) public view returns (File memory) {
        uint index = ownerFileIndexes[msg.sender][name];
        require(index > 0, "File doesn't exist");
        return (files[index - 1]);
    }


    function addFile(string memory name, string[] memory ipfsHashes, string memory hash, string memory timeStamp) public  {
        bytes memory tempName = bytes(name);
        bytes memory tempHash = bytes(hash);
        bytes memory tempTimeStamp = bytes(timeStamp);
        
        require(ipfsHashes.length == 3, "IPFS hashes should be provided for all three positions");
        require(tempName.length > 0, "File name cannot be omitted");
        require(tempHash.length > 0, "File hash cannot be omitted");
        require(tempTimeStamp.length > 0, "File timestamp cannot be omitted");
        
        uint index = ownerFileIndexes[msg.sender][name];
        
        if(index > 0){
            files[index - 1].fileIpfsHashes.push(ipfsHashes);
            files[index - 1].hashes.push(hash);
            files[index - 1].timestamps.push(timeStamp);
        }else{
            string[][] memory ipfsMatrix = new string[][](1);
            string[] memory hashes = new string[](1);
            string[] memory timestamps = new string[](1);

            timestamps[0] = timeStamp;
            hashes[0] = hash;
            ipfsMatrix[0] = ipfsHashes;
            File memory file = File(name, ipfsMatrix, hashes, msg.sender, timestamps);
            files.push(file);
            ownerFileIndexes[msg.sender][name] = files.length;
        }
    }

    function shareAccessToFile(string memory name, address account) public{
        uint index = ownerFileIndexes[msg.sender][name];
        require(index > 0, "File doesn't exist or account has no access to it");
        require(files[index - 1].owner == msg.sender, "Only the owner can share a file");
        ownerFileIndexes[account][name] = ownerFileIndexes[msg.sender][name];
    }

    function revokeAccessToFile(string memory name, address account) public {
        uint index = ownerFileIndexes[msg.sender][name];
        require(index > 0, "File doesn't exist");
        require(files[index - 1].owner == msg.sender, "Only the owner can revoke access to a file");
        ownerFileIndexes[account][name] = 0;
    }

    function removeFile(string memory name) public {
        uint index = ownerFileIndexes[msg.sender][name];
        require(index > 0, "File doesn't exist");
        require(files[index - 1].owner == msg.sender, "Only the owner can delete a file");
        
        ownerFileIndexes[msg.sender][name] = 0;
        files[index - 1].fileIpfsHashes = new string[3][](0);  
        files[index - 1].hashes = new string[](0);
        files[index - 1].name = new string(0);            
    }

























    function createAccount(string memory name, address accountAddress, string memory privateKey) public returns (Account memory newAccount){
        Account memory existingAccount = accounts[name];
        require(existingAccount.exists == false, "Account already exists");
        // require(msg.sender == accounts["Admin"].accountAddress, "Only admins can modify accounts");

        Account memory account = Account(name, accountAddress, privateKey, true);
        accounts[name] = account;
        accountNames.push(name);

        return account;
    }

    function deleteAccount(string memory name) public {
        
        // require(msg.sender == accounts["Admin"].accountAddress, "Only admins can modify accounts");
        // require(keccak256(bytes(name)) != keccak256(bytes("Admin")), "Can t delete Admin");
        Account memory existingAccount = accounts[name];
        require(existingAccount.exists == true, "Account doesn t exists");

        for (uint i = 0; i<accountNames.length; i++){
             //console.log("from %s to %s", accountNames[i], name);

            if(keccak256(bytes(accountNames[i])) == keccak256(bytes(name))){
                for(uint j = i; j<accountNames.length-1; j++){
                    accountNames[j] = accountNames[j+1];
                    //console.log("here %s, %s", accountNames[j], accountNames[j+1]);
                    delete accounts[name];
                }
                accountNames.pop();
            }
                
        }
    }

    function getAccounts() public view returns (string[] memory accountsList) {
        return (accountNames);
    }

    function getAccount(string memory name) public view returns (Account memory accountsList) {
        Account memory existingAccount = accounts[name];
        require(existingAccount.exists == true, "Account doesn t exists");
        return (accounts[name]);
    }

    function getAccountsInfo() public view returns (Account[] memory accountsList) {
        //require(msg.sender != accounts["Admin"].accountAddress, "Only admin can access it");
        uint accountsCount = accountNames.length;
        Account[] memory tempAccounts = new Account[](accountsCount);
        for(uint i=0; i<accountsCount; i++){
            tempAccounts[i] = accounts[accountNames[i]];
        }
        return (tempAccounts);
    }


    

}
