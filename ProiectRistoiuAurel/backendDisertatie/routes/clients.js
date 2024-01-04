const express = require('express');
const router = express.Router();
const { client, newClient, modifyClient, deleteClient } = require('../controllers/clientController');
const {upload, getListFiles,download} = require("../controllers/file.controller");
const { rentals} = require('../controllers/jsonController');

router.route("/clients/getClients").get(client)
router.route("/clients/createClient").post(newClient)
router.route("/clients/editClient/:id").post(modifyClient)
router.route("/clients/deleteClient/:id").post(deleteClient)

router.route("/upload").post(upload)
router.route("/files").get(getListFiles)
router.route("/files/:name").get(download)

router.route("/rentals/getRentals").get(rentals)


module.exports = router;