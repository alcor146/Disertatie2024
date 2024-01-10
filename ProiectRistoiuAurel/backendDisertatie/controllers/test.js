import { create } from 'ipfs-http-client';
import secrets from 'secrets.js-grempe';
import { readFileSync } from 'fs';


const baseUrl = "http://localhost:3001/api/files";
const nodesAPI = [
  'http://localhost:5002',
  'http://localhost:5003',
  'http://localhost:5004'
]

const nodes = [];

for (let i=0; i<nodesAPI.length; i++){
  nodes.push(create({ url: nodesAPI[i]}));
}


export const upload = async (req, res, next) => {
  console.log(req.body)
  const data = req.file
  const HexData = data.toString('hex');
  const shares = secrets.share(HexData, 3, 2); // Split the base64 encoded content into 3 shares, require 2 for reconstruction
  const ipfsHashes = [];
    for (let i = 0; i < shares.length; i++) {
        const response = await nodes[i].add(shares[i]);
        const ipfsHash = response.cid.toString();
        ipfsHashes.push(ipfsHash);
        console.log(`Share ${i + 1} uploaded to IPFS with hash: ${ipfsHash}`);
    }
    console.log(ipfsHashes);
    res.status(200).send({
          message: "Uploaded the file successfully: " + req.file.originalname,
          data: ipfsHashes
        });

  // try {
  //   await uploadFile(req, res);
  //   if (req.file == undefined) {
  //     return res.status(400).send({ message: "Please upload a file!" });
  //   }
  //   console.log(req.file)
  //   res.status(200).send({
  //     message: "Uploaded the file successfully: " + req.file.originalname,
  //   });
  // } catch (err) {
  //   console.log(err)
  //   res.status(500).send({
  //     message: `Could not upload the file: ${req.file.originalname}. ${err}`,
  //   });
  // }





};

export const getListFiles = (req, res, next) => {
  const directoryPath = "resources/";
  console.log(directoryPath)
  fs.readdir(directoryPath, function (err, files) {
    if (err) {
      res.status(500).send({
        message: "Unable to scan files!",
      });
    }
    let fileInfos = [];
    files.forEach((file) => {
      fileInfos.push({
        name: file,
        url: baseUrl + file,
      });
    });
    console.log(fileInfos)
    res.status(200).json({success: true, message: 'GET /Carts Works!', data: fileInfos});
  });
};


exports.download = (req, res) => {
  const fileName = req.params.name;
  console.log(fileName)
  const file = path.resolve(__dirname, `../resources/${fileName}`);
  res.download(file); 
};
