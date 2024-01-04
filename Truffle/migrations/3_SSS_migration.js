const SSS = artifacts.require("ShamirSecretSharing");

module.exports = function(deployer) {
  deployer.deploy(SSS);
};