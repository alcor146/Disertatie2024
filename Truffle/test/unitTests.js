const FileManagement = artifacts.require("FileManagement");


contract("FileManagement", async (accounts) => {
    const owner = accounts[0];
    const user1 = accounts[1];
    const user2 = accounts[2];
    let fileManagement;

    before(async () => {
        fileManagement = await FileManagement.deployed();
        await fileManagement.addFile("file14", ["hash1a", "hash1b", "hash1c"], "hash1", "timestamp1", { from: owner });
        await fileManagement.addFile("file15", ["hash1a", "hash1b", "hash1c"], "hash1", "timestamp1", { from: user1 });
        await fileManagement.addFile("file16", ["hash1a", "hash1b", "hash1c"], "hash1", "timestamp1", { from: user2 });
    });
    
    it("should deploy properly", async () => {
        const fileManagement1 = await FileManagement.deployed();
        assert(fileManagement1.address !== '');
    });

    it("should add a file", async () => {
        await fileManagement.addFile("file1", ["hash1a", "hash1b", "hash1c"], "hash1", "timestamp1", { from: owner });
        const file = await fileManagement.getFile("file1", { from: owner });
        assert(file.name === "file1");
    });

    it("should retrieve file names for owner", async () => {
        const fileNames = await fileManagement.getFileNames({ from: owner });
        assert(fileNames.length > 0);
    });


    it("should share access to a file", async () => {
        
        await fileManagement.shareAccessToFile("file1", user1, { from: owner });
        const file = await fileManagement.getFile("file1", { from: user1 });
        assert(file.name === "file1");
    });

    it("should not allow non-owner to share access", async () => {
        
        try {
            await fileManagement.shareAccessToFile("file1", user2, { from: user1 });
            assert(false);
        } catch (error) {
            assert(error.message.includes("Only the owner can share a file"));
        }
    });

    it("should not allow non-owner to remove a file", async () => {
        
        try {
            await fileManagement.removeFile("file1", { from: user1 });
            assert(false);
        } catch (error) {
            assert(error.message.includes("Only the owner can delete a file"));
        }
    });

    it("should allow owner to remove a file", async () => {
        
        await fileManagement.removeFile("file1", { from: owner });
        try {
            await fileManagement.getFile("file1", { from: owner });
            assert(false);
        } catch (error) {
            assert(error.message.includes("File doesn't exist"));
        }
    });

    it("should retrieve files for owner", async () => {
        
        const files = await fileManagement.getFiles({ from: owner });
        assert(files.length > 0);
    });

    it("should not retrieve files for non-owner", async () => {
        
        const files = await fileManagement.getFiles({ from: user2 });
        assert(files.length === 1);
    });

    it("should add file versions correctly", async () => {
        
        const initialFile = await fileManagement.getFile("file14", { from: owner });
        await fileManagement.addFile("file14", ["hash5a", "hash5b", "hash5c"], "hash5", "timestamp5", { from: owner });
        const file = await fileManagement.getFile("file14", { from: owner });
        assert(file.fileIpfsHashes.length == initialFile.fileIpfsHashes.length + 1);
    });

    it("should not retrieve non-existent file", async () => {
        
        try {
            await fileManagement.getFile("nonexistent", { from: owner });
            assert(false);
        } catch (error) {
            //console.log(error.message)
            assert(error.message.includes("File doesn't exist"));
        }
    });

    it("should not allow adding a file with incorrect IPFS hashes length", async () => {
        
        try {
            const result = await fileManagement.addFile("file4", ["hash6a", "hash6b"], "hash6", "timestamp6", { from: owner });
            assert(false);
        } catch (error) {
            assert(error.message.includes("IPFS hashes should be provided for all three positions"));
        }
    });

    it("should retrieve correct file version hashes", async () => {
        
        const file = await fileManagement.getFile("file14", { from: owner });
        assert(file.fileIpfsHashes[0][0] === "hash1a");
        assert(file.fileIpfsHashes[1][0] === "hash5a");
    });

    

    it("should not allow sharing access to non-existent file", async () => {
        
        try {
            await fileManagement.shareAccessToFile("nonexistent", user2, { from: owner });
            assert(false);
        } catch (error) {
            // console.log(error.message)
            assert(error.message.includes("File doesn't exist"));
        }
    });

    it("should retrieve file timestamps", async () => {
        
        const file = await fileManagement.getFile("file14", { from: owner });
        assert(file.timestamps.length === 2);
    });

    it("should not add a file with an empty name", async () => {
        try {
            
            await fileManagement.addFile("", ["hash9a", "hash9b", "hash9c"], "", "", { from: owner });
            assert(false);
        } catch (error) {
            assert(error.message.includes("File name cannot be omitted")); 
        }
    });


    it("should not add a file with an empty timestamp", async () => {
        try {
            
            await fileManagement.addFile("file4", ["hash9a", "hash9b", "hash9c"], "hash9", "", { from: owner });
            assert(false);
        } catch (error) {
            assert(error.message.includes("File timestamp cannot be omitted")); 
        }
    });

    it("should not add a file with an empty hash", async () => {
        try {
            
            await fileManagement.addFile("file4", ["hash9a", "hash9b", "hash9c"], "", "timestamp9", { from: owner });
            assert(false);
        } catch (error) {
            assert(error.message.includes("File hash cannot be omitted")); 
        }
    });
    

    it("should revoke access to a shared file", async () => {
        
        await fileManagement.addFile("revokableFile", ["hash11a", "hash11b", "hash11c"], "hash11", "timestamp11", { from: owner });
        await fileManagement.shareAccessToFile("revokableFile", user1, { from: owner });
        await fileManagement.revokeAccessToFile("revokableFile", user1, { from: owner });
        try {
            await fileManagement.getFile("revokableFile", { from: user1 });
            assert(false);
        } catch (error) {
            assert(error.message.includes("File doesn't exist"));
        }
    });


    it("should correctly record timestamps", async () => {
        
        await fileManagement.addFile("timestampFile", ["hash15a", "hash15b", "hash15c"], "hash15", "timestamp15", { from: owner });
        const file = await fileManagement.getFile("timestampFile", { from: owner });
        assert(file.timestamps[0] === "timestamp15");
    });

    it("should not perform operations on non-existent files", async () => {
        
        try {
            await fileManagement.shareAccessToFile("nonExistentFile", user1, { from: owner });
            assert(false);
        } catch (error) {
            assert(error.message.includes("File doesn't exist"));
        }
        try {
            await fileManagement.removeFile("nonExistentFile", { from: owner });
            assert(false);
        } catch (error) {
            assert(error.message.includes("File doesn't exist"));
        }

        try {
            await fileManagement.getFile("nonExistentFile", { from: user1 });
            assert(false);
        } catch (error) {
            assert(error.message.includes("File doesn't exist"));
        }
    });

    
});
 