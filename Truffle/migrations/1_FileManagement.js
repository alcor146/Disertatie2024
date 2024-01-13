const FileManagement = artifacts.require("FileManagement");

module.exports = function(deployer) {
  deployer.deploy(FileManagement);
};