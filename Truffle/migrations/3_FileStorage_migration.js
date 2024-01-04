const FileStorageSSS = artifacts.require("FileStorage");

module.exports = function(deployer) {
  deployer.deploy(FileStorageSSS);
};