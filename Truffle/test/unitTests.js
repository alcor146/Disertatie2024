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
    
    it("1) should deploy properly", async () => {
        let start = Date.now();
        const fileManagement1 = await FileManagement.deployed();
        assert(fileManagement1.address !== '');

        let timeTaken = Date.now() - start;
        console.log("Total time taken : " + timeTaken+ " milliseconds");
    });

    it("2) should add a file", async () => {
        let start = Date.now();
        await fileManagement.addFile("file1", ["hash1a", "hash1b", "hash1c"], "hash1", "timestamp1", { from: owner });
        const file = await fileManagement.getFile("file1", { from: owner });
        assert(file.name === "file1");

        let timeTaken = Date.now() - start;
        console.log("Total time taken : " + timeTaken+ " milliseconds");
    });


    it("3) should share access to a file", async () => {
        let start = Date.now();
        await fileManagement.shareAccessToFile("file1", user1, { from: owner });
        const file = await fileManagement.getFile("file1", { from: user1 });
        assert(file.name === "file1");

        let timeTaken = Date.now() - start;
        console.log("Total time taken : " + timeTaken+ " milliseconds");
    });

    it("4) should not allow non-owner to share access", async () => {
        let start = Date.now();
        try {
            await fileManagement.shareAccessToFile("file1", user2, { from: user1 });
            assert(false);
        } catch (error) {
            assert(error.message.includes("Only the owner can share a file"));
        }

        let timeTaken = Date.now() - start;
        console.log("Total time taken : " + timeTaken+ " milliseconds");
    });

    it("5) should not allow non-owner to remove a file", async () => {

        let start = Date.now();

        
        try {
            await fileManagement.removeFile("file1", { from: user1 });
            assert(false);
        } catch (error) {
            assert(error.message.includes("Only the owner can delete a file"));
        }

        let timeTaken = Date.now() - start;
        console.log("Total time taken : " + timeTaken+ " milliseconds");


    });

    it("6) should allow owner to remove a file", async () => {
        let start = Date.now();
        await fileManagement.removeFile("file1", { from: owner });
        try {
            await fileManagement.getFile("file1", { from: owner });
            assert(false);
        } catch (error) {
            assert(error.message.includes("File doesn't exist"));
        }

        let timeTaken = Date.now() - start;
        console.log("Total time taken : " + timeTaken+ " milliseconds");
    });

    it("7) should retrieve files for owner", async () => {
        let start = Date.now();
        const files = await fileManagement.getFiles({ from: owner });
        assert(files.length > 0);

        let timeTaken = Date.now() - start;
        console.log("Total time taken : " + timeTaken+ " milliseconds");
    });

    it("8) should not retrieve files for non-owner", async () => {
        let start = Date.now();
        const files = await fileManagement.getFiles({ from: user2 });
        assert(files.length === 1);

        let timeTaken = Date.now() - start;
        console.log("Total time taken : " + timeTaken+ " milliseconds");
    });

    it("9) should add file versions correctly", async () => {
        let start = Date.now();
        const initialFile = await fileManagement.getFile("file14", { from: owner });
        await fileManagement.addFile("file14", ["hash5a", "hash5b", "hash5c"], "hash5", "timestamp5", { from: owner });
        const file = await fileManagement.getFile("file14", { from: owner });
        assert(file.fileIpfsHashes.length == initialFile.fileIpfsHashes.length + 1);

        let timeTaken = Date.now() - start;
        console.log("Total time taken : " + timeTaken+ " milliseconds");
    });

    it("10) should not retrieve non-existent file", async () => {
        let start = Date.now();
        try {
            await fileManagement.getFile("nonexistent", { from: owner });
            assert(false);
        } catch (error) {
            //console.log(error.message)
            assert(error.message.includes("File doesn't exist"));
        }

        let timeTaken = Date.now() - start;
        console.log("Total time taken : " + timeTaken+ " milliseconds");
    });

    it("11) should not allow adding a file with incorrect IPFS hashes length", async () => {
        let start = Date.now();
        try {
            const result = await fileManagement.addFile("file4", ["hash6a", "hash6b"], "hash6", "timestamp6", { from: owner });
            assert(false);
        } catch (error) {
            assert(error.message.includes("IPFS hashes should be provided for all three positions"));
        }

        let timeTaken = Date.now() - start;
        console.log("Total time taken : " + timeTaken+ " milliseconds");
    });

    it("12) should retrieve correct file version hashes", async () => {
        let start = Date.now();
        const file = await fileManagement.getFile("file14", { from: owner });
        assert(file.fileIpfsHashes[0][0] === "hash1a");
        assert(file.fileIpfsHashes[1][0] === "hash5a");

        let timeTaken = Date.now() - start;
        console.log("Total time taken : " + timeTaken+ " milliseconds");
    });

    

    it("13) should not allow sharing access to non-existent file", async () => {
        let start = Date.now();
        try {
            await fileManagement.shareAccessToFile("nonexistent", user2, { from: owner });
            assert(false);
        } catch (error) {
            // console.log(error.message)
            assert(error.message.includes("File doesn't exist"));
        }

        let timeTaken = Date.now() - start;
        console.log("Total time taken : " + timeTaken+ " milliseconds");
    });

    it("14) should retrieve file timestamps", async () => {
        let start = Date.now();
        const file = await fileManagement.getFile("file14", { from: owner });
        assert(file.timestamps.length === 2);

        let timeTaken = Date.now() - start;
        console.log("Total time taken : " + timeTaken+ " milliseconds");
    });

    it("15) should not add a file with an empty name", async () => {
        let start = Date.now();
        try {
            
            await fileManagement.addFile("", ["hash9a", "hash9b", "hash9c"], "", "", { from: owner });
            assert(false);
        } catch (error) {
            assert(error.message.includes("File name cannot be omitted")); 
        }

        let timeTaken = Date.now() - start;
        console.log("Total time taken : " + timeTaken+ " milliseconds");
    });


    it("16) should not add a file with an empty timestamp", async () => {
        let start = Date.now();
        try {
            
            await fileManagement.addFile("file4", ["hash9a", "hash9b", "hash9c"], "hash9", "", { from: owner });
            assert(false);
        } catch (error) {
            assert(error.message.includes("File timestamp cannot be omitted")); 
        }

        let timeTaken = Date.now() - start;
        console.log("Total time taken : " + timeTaken+ " milliseconds");
    });

    it("17) should not add a file with an empty hash", async () => {
        let start = Date.now();
        try {
            
            await fileManagement.addFile("file4", ["hash9a", "hash9b", "hash9c"], "", "timestamp9", { from: owner });
            assert(false);
        } catch (error) {
            assert(error.message.includes("File hash cannot be omitted")); 
        }

        let timeTaken = Date.now() - start;
        console.log("Total time taken : " + timeTaken+ " milliseconds");
    });
    

    it("18) should revoke access to a shared file", async () => {
        let start = Date.now();
        
        await fileManagement.addFile("revokableFile", ["hash11a", "hash11b", "hash11c"], "hash11", "timestamp11", { from: owner });
        await fileManagement.shareAccessToFile("revokableFile", user1, { from: owner });
        await fileManagement.revokeAccessToFile("revokableFile", user1, { from: owner });
        try {
            await fileManagement.getFile("revokableFile", { from: user1 });
            assert(false);
        } catch (error) {
            assert(error.message.includes("File doesn't exist"));
        }

        let timeTaken = Date.now() - start;
        console.log("Total time taken : " + timeTaken+ " milliseconds");
    });


    it("19) should correctly record timestamps", async () => {
        let start = Date.now();
        await fileManagement.addFile("timestampFile", ["hash15a", "hash15b", "hash15c"], "hash15", "timestamp15", { from: owner });
        const file = await fileManagement.getFile("timestampFile", { from: owner });
        assert(file.timestamps[0] === "timestamp15");

        let timeTaken = Date.now() - start;
        console.log("Total time taken : " + timeTaken+ " milliseconds");
    });

    it("20) should not perform operations on non-existent files", async () => {
        let start = Date.now();
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

        let timeTaken = Date.now() - start;
        console.log("Total time taken : " + timeTaken+ " milliseconds");
    });

    it("21) should download a file", async () => {
        let start = Date.now();
        const file = await fileManagement.getFile("file16", { from: user2 });
        assert(file.name === "file16");

        let timeTaken = Date.now() - start;
        console.log("Total time taken : " + timeTaken+ " milliseconds");
    });

    
});
 