
var xml2js = require("xml2js")
    fs = require("fs")
    path = require("path");
 
exports.client = async (req, res, next) => {

    var parser = new xml2js.Parser();
    try{
        fs.readFile("resources/data.xml", function(err, data) {
            parser.parseString(data, function (err, result) { 
                console.log(result)
                if(!result)
                    res.status(404).json({success: false})
                else
                    res.status(200).json({success: true, db: result})
            });
        });
    }catch(err){
        console.log(err)
    }
}

exports.newClient = async (req, res, next) => {
    console.log(req.body)
    const builder = new xml2js.Builder()
    const xml = builder.buildObject(req.body)
    console.log(path.resolve(__dirname, "../db/data.xml"))
    fs.writeFileSync(path.resolve(__dirname, "../db/data.xml"), xml, function(err, file){
        if(err)
            res.status(404).json({success: false})
        else
            res.status(200).json({success: true})
    });
}

exports.modifyClient = async (req, res, next) => {
    console.log(req.body)
    const builder = new xml2js.Builder()
    const xml = builder.buildObject(req.body)
    console.log(path.resolve(__dirname, "../db/data.xml"))
    fs.writeFileSync(path.resolve(__dirname, "../db/data.xml"), xml, function(err, file){
        if(err)
            res.status(404).json({success: false})
        else
            res.status(200).json({success: true})
    });
}

exports.deleteClient = async (req, res, next) => {
    console.log(req.body)
    const builder = new xml2js.Builder()
    const xml = builder.buildObject(req.body)
    console.log(path.resolve(__dirname, "../db/data.xml"))
    fs.writeFileSync(path.resolve(__dirname, "../db/data.xml"), xml, function(err, file){
        if(err)
            res.status(404).json({success: false})
        else
            res.status(200).json({success: true})
    });
}