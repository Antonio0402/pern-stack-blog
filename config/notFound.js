"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var notFound = function (req, res) {
    res.status(404);
    var error = "\uD83D\uDD0D - Not Found - ".concat(req.originalUrl);
    if (req.accepts("json")) {
        res.json({ "Error": error });
    }
    else {
        res.type("txt").send(error);
    }
};
exports.default = notFound;
