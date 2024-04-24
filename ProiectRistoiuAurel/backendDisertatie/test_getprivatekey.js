import keythereum from 'keythereum';

var datadir = "../../laborator/lab_datadir/node2";
var address= "0x510f0a55f962eb67daa8a20553fa897157466f9f";
const password = "123";

var keyObject = keythereum.importFromFile(address, datadir);
var privateKey = keythereum.recover(password, keyObject);
console.log(privateKey.toString('hex'));