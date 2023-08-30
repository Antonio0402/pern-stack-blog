import path from "node:path";
import multer from "multer";
const __dirname = path.resolve();

//* setup multiple file upload
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/gif": "gif",
  // you can add more here
};

//* check fileType
const checkFileType = function (file: Express.Multer.File, callback: multer.FileFilterCallback) {
  //Allowed file extensions
  const fileTypes = /jpeg|jpg|png|gif/;

  //check extension names
  const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());

  const mimeType = fileTypes.test(file.mimetype);

  if (mimeType && extName) {
    return callback(null, true);
  } else {
    callback(new Error("Error: You can Only Upload Images!!"));
  }
};
const storage = multer.diskStorage({
  destination(_req, _file, callback) {
    callback(null, path.join(__dirname, './upload'));
    // Note ./upload path should be relative. Change this path according to your folder structure
  },
  filename(_req, file, callback) {
    const name = file.originalname.split(" ").join("_");
    const extension = MIME_TYPES[file.mimetype as keyof typeof MIME_TYPES];
    callback(null, name + Date.now() + "." + extension);
  },
})

//* single file
const upload = multer({
  storage: storage,
  limits: { fileSize: 2000000 }, //* 1MB
  fileFilter(_req, file, callback) {
    checkFileType(file, callback);
  },
})
//* multiple files
const uploads = multer({ storage: storage }).array('file', 12);

export default upload;