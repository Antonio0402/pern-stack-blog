"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var errHandler = function (err, _req, res) {
    var statusCode = res.statusCode !== 200 ? res.statusCode : 500;
    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? '🥞' : err.stack
    });
};
exports.default = errHandler;
