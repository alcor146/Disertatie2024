import express from "express";
export const router = express.Router();

import  {upload, getListFiles, download, deleteFile, shareFile, denyFile, createAccount, deleteAccount, listAccounts, uploadTest, downloadTest} from  "../controllers/file.controller.js";



router.route("/upload").post(upload);
router.route("/files").get(getListFiles);
router.route("/documents/:name").get(download);
router.route("/documents").delete(deleteFile);
router.route("/documents/share").post(shareFile);
router.route("/documents/deny").post(denyFile);
router.route("/accounts/create").post(createAccount);
router.route("/accounts/delete").post(deleteAccount);
router.route("/accounts/list").post(listAccounts);

router.route("/upload/test").post(uploadTest);
router.route("/download/test/:name").post(downloadTest);


