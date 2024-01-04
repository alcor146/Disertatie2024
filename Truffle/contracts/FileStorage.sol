// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;
import "./ShamirSecretSharing.sol";

contract FileStorage {
    struct File {
        string name;
        uint8 threshold; // Threshold for Shamir's Secret Sharing (4)
        uint8 numShares; // Number of shares for Shamir's Secret Sharing (4)
        uint256[] contentShares; // Shamir's Secret Sharing shares of content (4 shares)
        address owner;
    }

    File[] public files;
    mapping(address => uint[]) private ownerIndexes;
    uint256 public fileId;  

    uint8 constant public THRESHOLD = 2; // Minimum number of shares to reconstruct
    uint8 constant public TOTAL_SHARES = 3; // Total number of shares to generate

    // Initialize the Shamir's Secret Sharing contract
    ShamirSecretSharing public sss;

    constructor() {
        fileId = 0;
        sss = new ShamirSecretSharing();
    }

    function addFile(string memory name, string memory content) public {

        uint256 index = files.length;

        // Hash the content using SHA-256
        bytes32 contentHash = sha256(bytes(content));

        // Split the content hash into shares using the ShamirSecretSharing contract
        uint256[] memory contentShares = sss.splitSecret(uint256(contentHash), THRESHOLD, TOTAL_SHARES);

        files.push(File(name, THRESHOLD, TOTAL_SHARES, contentShares, msg.sender));
        ownerIndexes[msg.sender].push(index);
        fileId++;
    }

    function getFile(uint256 _fileId) public view returns (string memory name, string memory content) {
        require(_fileId < files.length, "File does not exist");
        require(msg.sender == files[_fileId].owner, "You are not authorized to view this file.");

        // Retrieve the content shares from the file
        uint256[] memory contentShares = files[_fileId].contentShares;

        // Reconstruct the content using the shares
        uint256 secret = sss.combineShares(contentShares, THRESHOLD);
        string memory reconstructedContent = bytes32ToString(bytes32(secret));

        return (files[_fileId].name, reconstructedContent);
    }

    // Utility function to convert bytes32 to a string
    function bytes32ToString(bytes32 _bytes32) internal pure returns (string memory) {
        uint8 i = 0;
        while (i < 32 && _bytes32[i] != 0) {
            i++;
        }
        bytes memory bytesArray = new bytes(i);
        for (i = 0; i < 32 && _bytes32[i] != 0; i++) {
            bytesArray[i] = _bytes32[i];
        }
        return string(bytesArray);
    }

    // Function to retrieve the shares for a file
    function getFileShares(uint256 _fileId) public view returns (uint256[] memory) {
        require(_fileId < files.length, "File does not exist");
        require(msg.sender == files[_fileId].owner, "You are not authorized to view this file's shares.");
        return files[_fileId].contentShares;
    }
}