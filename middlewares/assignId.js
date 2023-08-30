"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var uuid = require("uuid");
var assignId = function (req, _res, next) {
    req.id = uuid.v4();
    next();
};
exports.default = assignId;
