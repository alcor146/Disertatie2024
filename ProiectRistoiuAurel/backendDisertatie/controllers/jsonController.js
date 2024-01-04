

const fs = require('fs');

exports.rentals = async (req, res, next) => { 

    try{
        let rawdata = fs.readFileSync("resources/data.json");
        let rentals = JSON.parse(rawdata);
        res.json({data: rentals})
        console.log(rentals)
    }catch(err){
        console.log(err)
    }

    
}