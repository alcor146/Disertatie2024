pragma solidity ^0.8.13;
// SPDX-License-Identifier: MIT

contract FileManagement {

    struct File {
        string name;
        string[3][] fileIpfsHashes; // Matrix to store three IPFS hashes for each version
        string[] hashes;
        address owner;
        
    }

    File[] public files;
    mapping(address => mapping(string => uint)) private ownerFileIndexes;


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

    function getAllFiles() public view returns (string[] memory) {
         uint256 fileCount = files.length;

        // Temporary array to store filtered file names
        string[] memory ownerFiles = new string[](fileCount);

        for (uint256 i = 0; i < fileCount; i++) {
                ownerFiles[i] = files[i].name;
        }

        return ownerFiles;
    }

    function getAll() public view returns (File[] memory) {
        return files;
    }


    function addFile(string memory name, string[3] memory ipfsHashes, string memory hash) public  {
        require(ipfsHashes.length == 3, "IPFS hashes should be provided for all three positions");

        uint index = ownerFileIndexes[msg.sender][name];
        

        if(index > 0){
            files[index - 1].fileIpfsHashes.push(ipfsHashes);
            files[index - 1].hashes.push(hash);
        }else{
            string[3][] memory ipfsMatrix = new string[3][](1);
            string[] memory hashes = new string[](1);

            hashes[0] = hash;
            ipfsMatrix[0] = ipfsHashes;
            File memory file = File(name, ipfsMatrix, hashes, msg.sender);
            files.push(file);
            ownerFileIndexes[msg.sender][name] = files.length;
        }
    }

    function getFile(string memory name) public view returns (File memory) {
        uint index = ownerFileIndexes[msg.sender][name];
        require(index > 0, "File not found");
        return (files[index - 1]);
    }

    function removeFile(string memory name) public {

        uint index = ownerFileIndexes[msg.sender][name];
        require(index > 0, "File doesn t exist");
        
        ownerFileIndexes[msg.sender][name] = 0;
        files[index - 1].fileIpfsHashes = new string[3][](0);  
        files[index - 1].hashes = new string[](0);            
    }

    function testContract1() public pure returns (uint, uint) {
        uint x=41;
        uint y=32;
        return (x, y);
    }

}
