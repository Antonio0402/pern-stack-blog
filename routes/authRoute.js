"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var authController_js_1 = require("../controllers/authController.js");
var registerController_js_1 = require("../controllers/registerController.js");
var logoutController_js_1 = require("../controllers/logoutController.js");
var refreshController_js_1 = require("../controllers/refreshController.js");
var authRoute = express_1.default.Router();
authRoute
    .post("/login", authController_js_1.default)
    .post("/register", registerController_js_1.default)
    .get("/refresh", refreshController_js_1.default)
    .post("/logout", logoutController_js_1.default);
exports.default = authRoute;
