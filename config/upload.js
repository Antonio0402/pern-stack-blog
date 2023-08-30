"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var node_path_1 = require("node:path");
var multer_1 = require("multer");
var __dirname = node_path_1.default.resolve();
//* setup multiple file upload
var MIME_TYPES = {
    "image/jpg": "jpg",
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/gif": "gif",
    // you can add more here
};
//* check fileType
var checkFileType = function (file, callback) {
    //Allowed file extensions
    var fileTypes = /jpeg|jpg|png|gif/;
    //check extension names
    var extName = fileTypes.test(node_path_1.default.extname(file.originalname).toLowerCase());
    var mimeType = fileTypes.test(file.mimetype);
    if (mimeType && extName) {
        return callback(null, true);
    }
    else {
        callback(new Error("Error: You can Only Upload Images!!"));
    }
};
var storage = multer_1.default.diskStorage({
    destination: function (_req, _file, callback) {
        callback(null, node_path_1.default.join(__dirname, './upload'));
        // Note ./upload path should be relative. Change this path according to your folder structure
    },
    filename: function (_req, file, callback) {
        var name = file.originalname.split(" ").join("_");
        var extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + "." + extension);
    },
});
//* single file
var upload = (0, multer_1.default)({
    storage: storage,
    limits: { fileSize: 2000000 },
    fileFilter: function (_req, file, callback) {
        checkFileType(file, callback);
    },
});
//* multiple files
var uploads = (0, multer_1.default)({ storage: storage }).array('file', 12);
exports.default = upload;
