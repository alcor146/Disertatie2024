const FileManagement = artifacts.require("FileManagement");

contract("FileManagement", (accounts) => {
    const owner = accounts[0];
    const user1 = accounts[1];
    const user2 = accounts[2];
    
    // it("should deploy properly", async () => {
    //     const fileManagement = await FileManagement.deployed();
    //     assert(fileManagement.address !== '');
    // });

    // it("should add a file", async () => {
    //     const fileManagement = await FileManagement.deployed();
    //     await fileManagement.addFile("file1", ["hash1a", "hash1b", "hash1c"], "hash1", "timestamp1", { from: owner });
    //     const file = await fileManagement.getFile("file1", { from: owner });
    //     assert(file.name === "file1");
    // });

    // it("should retrieve file names for owner", async () => {
    //     const fileManagement = await FileManagement.deployed();
    //     await fileManagement.addFile("file2", ["hash2a", "hash2b", "hash2c"], "hash2", "timestamp2", { from: owner });
    //     const fileNames = await fileManagement.getFileNames({ from: owner });
    //     assert(fileNames.length === 2);
    //     assert(fileNames.includes("file1") && fileNames.includes("file2"));
    // });


    // it("should share access to a file", async () => {
    //     const fileManagement = await FileManagement.deployed();
    //     await fileManagement.shareAccessToFile("file1", user1, { from: owner });
    //     const file = await fileManagement.getFile("file1", { from: user1 });
    //     assert(file.name === "file1");
    // });

    // it("should not allow non-owner to share access", async () => {
    //     const fileManagement = await FileManagement.deployed();
    //     try {
    //         await fileManagement.shareAccessToFile("file1", user2, { from: user1 });
    //         assert(false);
    //     } catch (error) {
    //         //console.log(error)
    //         assert(error.message.includes("Only the owner can share a file"));
    //     }
    // });

    // it("should not allow non-owner to remove a file", async () => {
    //     const fileManagement = await FileManagement.deployed();
    //     try {
    //         await fileManagement.removeFile("file1", { from: user1 });
    //         assert(false);
    //     } catch (error) {
    //         assert(error.message.includes("Only the owner can delete a file"));
    //     }
    // });

    // it("should allow owner to remove a file", async () => {
    //     const fileManagement = await FileManagement.deployed();
    //     await fileManagement.removeFile("file1", { from: owner });
    //     try {
    //         await fileManagement.getFile("file1", { from: owner });
    //         assert(false);
    //     } catch (error) {
    //         assert(error.message.includes("File doesn't exist"));
    //     }
    // });

    // it("should retrieve files for owner", async () => {
    //     const fileManagement = await FileManagement.deployed();
    //     await fileManagement.addFile("file3", ["hash4a", "hash4b", "hash4c"], "hash4", "timestamp4", { from: owner });
    //     const files = await fileManagement.getFiles({ from: owner });
    //     assert(files.length === 2);
    // });

    // it("should not retrieve files for non-owner", async () => {
    //     const fileManagement = await FileManagement.deployed();
    //     const files = await fileManagement.getFiles({ from: user2 });
    //     assert(files.length === 0);
    // });

    // it("should add file versions correctly", async () => {
    //     const fileManagement = await FileManagement.deployed();
    //     const initialFile = await fileManagement.getFile("file3", { from: owner });
    //     await fileManagement.addFile("file3", ["hash5a", "hash5b", "hash5c"], "hash5", "timestamp5", { from: owner });
    //     const file = await fileManagement.getFile("file3", { from: owner });
    //     assert(file.fileIpfsHashes.length == initialFile.fileIpfsHashes.length + 1);
    // });

    // it("should not retrieve non-existent file", async () => {
    //     const fileManagement = await FileManagement.deployed();
    //     try {
    //         await fileManagement.getFile("nonexistent", { from: owner });
    //         assert(false);
    //     } catch (error) {
    //         //console.log(error.message)
    //         assert(error.message.includes("File doesn't exist"));
    //     }
    // });

    // it("should not allow adding a file with incorrect IPFS hashes length", async () => {
    //     const fileManagement = await FileManagement.deployed();
    //     try {
    //         const result = await fileManagement.addFile("file4", ["hash6a", "hash6b"], "hash6", "timestamp6", { from: owner });
    //         assert(false);
    //     } catch (error) {
    //         assert(error.message.includes("IPFS hashes should be provided for all three positions"));
    //     }
    // });

    // it("should retrieve correct file version hashes", async () => {
    //     const fileManagement = await FileManagement.deployed();
    //     const file = await fileManagement.getFile("file3", { from: owner });
    //     assert(file.fileIpfsHashes[0][0] === "hash4a");
    //     assert(file.fileIpfsHashes[1][0] === "hash5a");
    // });

    

    // it("should not allow sharing access to non-existent file", async () => {
    //     const fileManagement = await FileManagement.deployed();
    //     try {
    //         await fileManagement.shareAccessToFile("nonexistent", user2, { from: owner });
    //         assert(false);
    //     } catch (error) {
    //         // console.log(error.message)
    //         assert(error.message.includes("File doesn't exist"));
    //     }
    // });


    // it("should handle file removal and index adjustment", async () => {
    //     const fileManagement = await FileManagement.deployed();
    //     await fileManagement.addFile("tempFile", ["hash8a", "hash8b", "hash8c"], "hash8", "timestamp8", { from: owner });
    //     await fileManagement.removeFile("tempFile", { from: owner });
    //     const files = await fileManagement.getFiles({ from: owner });
    //     assert(files.length === 2);  // "tempFile" was added and then removed
    // });

    // it("should retrieve file timestamps", async () => {
    //     const fileManagement = await FileManagement.deployed();
    //     const file = await fileManagement.getFile("file3", { from: owner });
    //     assert(file.timestamps.length === 2);
    // });

    // it("should not add a file with an empty name", async () => {
    //     try {
    //         const fileManagement = await FileManagement.deployed();
    //         await fileManagement.addFile("", ["hash9a", "hash9b", "hash9c"], "", "", { from: owner });
    //         assert(false);
    //     } catch (error) {
    //         assert(error.message.includes("File name cannot be omitted")); 
    //     }
    // });


    // it("should not add a file with an empty timestamp", async () => {
    //     try {
    //         const fileManagement = await FileManagement.deployed();
    //         await fileManagement.addFile("file4", ["hash9a", "hash9b", "hash9c"], "hash9", "", { from: owner });
    //         assert(false);
    //     } catch (error) {
    //         assert(error.message.includes("File timestamp cannot be omitted")); 
    //     }
    // });

    // it("should not add a file with an empty hash", async () => {
    //     try {
    //         const fileManagement = await FileManagement.deployed();
    //         await fileManagement.addFile("file4", ["hash9a", "hash9b", "hash9c"], "", "timestamp9", { from: owner });
    //         assert(false);
    //     } catch (error) {
    //         assert(error.message.includes("File hash cannot be omitted")); 
    //     }
    // });
    

    // it("should revoke access to a shared file", async () => {
    //     const fileManagement = await FileManagement.deployed();
    //     await fileManagement.addFile("revokableFile", ["hash11a", "hash11b", "hash11c"], "hash11", "timestamp11", { from: owner });
    //     await fileManagement.shareAccessToFile("revokableFile", user1, { from: owner });
    //     await fileManagement.revokeAccessToFile("revokableFile", user1, { from: owner });
    //     try {
    //         await fileManagement.getFile("revokableFile", { from: user1 });
    //         assert(false);
    //     } catch (error) {
    //         assert(error.message.includes("File doesn't exist"));
    //     }
    // });

    // it("should handle simultaneous file additions", async () => {
    //     const fileManagement = await FileManagement.deployed();
    //     await Promise.all([
    //         fileManagement.addFile("simulFile1", ["hash13a", "hash13b", "hash13c"], "hash13", "timestamp13", { from: owner }),
    //         fileManagement.addFile("simulFile2", ["hash14a", "hash14b", "hash14c"], "hash14", "timestamp14", { from: user1 })
    //     ]);

    //     const ownerFiles = await fileManagement.getFileNames({ from: owner });
    //     const user1Files = await fileManagement.getFileNames({ from: user1 });

    //     assert(ownerFiles.includes("simulFile1"));
    //     assert(user1Files.includes("simulFile2"));
    // });

    // it("should correctly record timestamps", async () => {
    //     const fileManagement = await FileManagement.deployed();
    //     await fileManagement.addFile("timestampFile", ["hash15a", "hash15b", "hash15c"], "hash15", "timestamp15", { from: owner });
    //     const file = await fileManagement.getFile("timestampFile", { from: owner });
    //     assert(file.timestamps[0] === "timestamp15");
    // });

    // it("should not perform operations on non-existent files", async () => {
    //     const fileManagement = await FileManagement.deployed();
    //     try {
    //         await fileManagement.shareAccessToFile("nonExistentFile", user1, { from: owner });
    //         assert(false);
    //     } catch (error) {
    //         assert(error.message.includes("File doesn't exist"));
    //     }
    //     try {
    //         await fileManagement.removeFile("nonExistentFile", { from: owner });
    //         assert(false);
    //     } catch (error) {
    //         assert(error.message.includes("File doesn't exist"));
    //     }

    //     try {
    //         await fileManagement.getFile("nonExistentFile", { from: user1 });
    //         assert(false);
    //     } catch (error) {
    //         assert(error.message.includes("File doesn't exist"));
    //     }
    // });

    it("should not share access with an invalid address", async () => {
        const fileManagement = await FileManagement.deployed();
        await fileManagement.addFile("invalidShareFile", ["hash12a", "hash12b", "hash12c"], "hash12", "timestamp12", { from: owner });
        try {
            let index = await fileManagement.shareAccessToFile("invalidShareFile", "0x0000000000000000000000000000001100000000", { from: owner });
            console.log("INDEX",index)
            assert(false);
        } catch (error) {
            console.log("ERROR: ", error)
            assert(error.message.includes("Invalid address"));
        }
    });
});
 