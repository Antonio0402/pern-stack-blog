"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var getPost_js_1 = require("../controllers/post/getPost.js");
var updatePost_js_1 = require("../controllers/post/updatePost.js");
var createPost_js_1 = require("../controllers/post/createPost.js");
var deletePost_js_1 = require("../controllers/post/deletePost.js");
var postRoute = express_1.default.Router();
postRoute
    .post("/", createPost_js_1.default)
    .get("/:id", getPost_js_1.default)
    .delete("/:id", deletePost_js_1.default)
    .put("/:id", updatePost_js_1.default);
exports.default = postRoute;
