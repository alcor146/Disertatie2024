import express from "express";
export const router = express.Router();

import  {upload, getListFiles, download} from  "../controllers/file.controller.js";

router.route("/upload").post(upload);
router.route("/files").get(getListFiles);
router.route("/documents/:name").get(download);


