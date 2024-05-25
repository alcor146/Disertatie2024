import keythereum from 'keythereum';

var datadir = "../../laborator/lab_datadir/node3";
var address= "0xe2c17ef972951095173d2470d9cd34449f3d4b09";
const password = "123";

var keyObject = keythereum.importFromFile(address, datadir);
var privateKey = keythereum.recover(password, keyObject);
console.log(privateKey.toString('hex'));

console.log(new Date().toLocaleTimeString())

function getTimestamp () {
    const pad = (n,s=2) => (`${new Array(s).fill(0)}${n}`).slice(-s);
    const d = new Date();
    
    return `${pad(d.getFullYear(),4)}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  }

  console.log(getTimestamp())