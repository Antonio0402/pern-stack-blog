"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var processImage = function (req, res) {
    var _a;
    if (req.file) {
        var url = req.protocol + "://" + req.get("host");
        var file = url + "/api/v1/images/" + ((_a = req.file) === null || _a === void 0 ? void 0 : _a.filename);
        res.status(201).json({
            message: "Success",
            file: file,
        });
    }
    else {
        res.status(400).json("Please upload a valid image");
    }
};
var processFiles = function (req, res) {
    var _a;
    var files = [];
    var url = req.protocol + "://" + req.get("host");
    (_a = req.files) === null || _a === void 0 ? void 0 : _a.forEach(function (file) {
        var file_url = url + "/api/v1/images/" + file.filename;
        files.push({
            url: file_url,
        });
    });
    res.status(201).json({
        message: "files saved successfully!",
        files: files,
    });
};
exports.default = processImage;
