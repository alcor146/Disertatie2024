const uploadFile = require("../middleware/upload");
var fs = require("fs")
const baseUrl = "http://localhost:3001/api/files";

exports.upload = async (req, res) => {
  try {
    await uploadFile(req, res);
    if (req.file == undefined) {
      return res.status(400).send({ message: "Please upload a file!" });
    }
    console.log(req.file)
    res.status(200).send({
      message: "Uploaded the file successfully: " + req.file.originalname,
    });
  } catch (err) {
    console.log(err)
    res.status(500).send({
      message: `Could not upload the file: ${req.file.originalname}. ${err}`,
    });
  }
};
exports.getListFiles = (req, res) => {
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
    res.status(200).send(fileInfos);
  });
};


exports.download = (req, res) => {
  const fileName = req.params.name;
  console.log(fileName)
  const file = path.resolve(__dirname, `../resources/${fileName}`);
  res.download(file); 
};
