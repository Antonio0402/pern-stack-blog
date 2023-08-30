"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var allowedOrigins_js_1 = require("./allowedOrigins.js");
var corsOptions = {
    origin: function (origin, cb) {
        if (!origin || allowedOrigins_js_1.default.indexOf(origin) !== -1) {
            cb(null, true);
        }
        else {
            cb(new Error("Not allowed by CORS"));
        }
    },
    optionsSuccessStatus: 200,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Origin", 'X-Requested-With', "Content", 'Accept', "Content-Type", "Authorization", "Cookie"],
    maxAge: 86400,
    credentials: true,
};
exports.default = corsOptions;
