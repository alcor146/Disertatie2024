import multer from "multer";

const maxSize = 2 * 1024 * 1024;
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "resources/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const uploadFileMiddleware = multer({
  storage: storage,
  limits: { fileSize: maxSize },
}).single("file");

export { uploadFileMiddleware }; // Exporting the multer instance directly