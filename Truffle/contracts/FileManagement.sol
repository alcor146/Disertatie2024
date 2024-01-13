

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

        string[] memory storedFiles = new string[](fileCount);

        for (uint256 i = 0; i < fileCount; i++) {
            storedFiles[i] = files[i].name;
        }

        return storedFiles;
    }

    function addFile(string memory name, string[3] memory ipfsHashes, string memory hash) public {
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
            files.push(File(name, ipfsMatrix, hashes, msg.sender));
        }
    }

    function getFile(string memory name) public view returns (string memory, string[3][] memory) {
        uint index = ownerFileIndexes[msg.sender][name];
        require(index > 0, "File not found");
        return (files[index - 1].name, files[index - 1].fileIpfsHashes);
    }

    function testContract() public pure returns (uint) {
        uint x=1;
        return x;
    }

}
