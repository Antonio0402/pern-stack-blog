"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var uuid_1 = require("uuid");
var morgan_1 = require("morgan");
var cors_1 = require("cors");
var node_path_1 = require("node:path");
var dotenv = require("dotenv");
var dotenv_expand_1 = require("dotenv-expand");
dotenv_expand_1.default.expand(dotenv.config({
    path: "../.env"
}));
var assignId_js_1 = require("./middlewares/assignId.js");
var logger_js_1 = require("./middlewares/logger.js");
var credentials_js_1 = require("./config/credentials.js");
var helmet_1 = require("helmet");
var corsOptions_js_1 = require("./config/corsOptions.js");
var errHandler_js_1 = require("./middlewares/errHandler.js");
var notFound_js_1 = require("./config/notFound.js");
var express_session_1 = require("express-session");
var cookie_parser_1 = require("cookie-parser");
var connect_pg_simple_1 = require("connect-pg-simple");
var connectPG_js_1 = require("./config/connectPG.js");
var verifyToken_js_1 = require("./middlewares/verifyToken.js");
var authRoute_js_1 = require("./routes/authRoute.js");
var postRoute_js_1 = require("./routes/postRoute.js");
var getPosts_js_1 = require("./controllers/post/getPosts.js");
var getUser_js_1 = require("./controllers/user/getUser.js");
var uploadImage_js_1 = require("./controllers/upload/uploadImage.js");
var upload_js_1 = require("./config/upload.js");
var __dirname = node_path_1.default.resolve();
/**
 * -------------- GENERAL SETUP ----------------
 */
if (!process.env.PORT && !process.env.CLIENT_ORIGIN_URL) {
    throw new Error("Mising required environment variables");
}
var port = process.env.PORT;
var app = (0, express_1.default)();
app.use(express_1.default.static(node_path_1.default.join(__dirname, "../client/build")));
//* Creating new tokens for id and origin to set log format
morgan_1.default.token('id', function getId(req) {
    return req.id;
});
morgan_1.default.token('origin', function getOrigin(req, _res) { return req.headers.origin; });
app.use(assignId_js_1.default);
app.use((0, morgan_1.default)(':date[web] :id :method :origin :url', {
    stream: await (0, logger_js_1.default)("reqLog.txt")
}));
//* Handle options credentials check - before CORS
//* and fetch cookies credentials requirement
app.use(credentials_js_1.default);
app.use((0, helmet_1.default)({
    hsts: {
        maxAge: 31536000,
    },
    contentSecurityPolicy: {
        useDefaults: false,
        directives: {
            "default-src": ["'none'"],
            "frame-ancestors": ["'none'"],
        },
    },
    frameguard: {
        action: "deny",
    },
}));
//* Cross Origin Resource Sharing
app.use((0, cors_1.default)(corsOptions_js_1.default));
//* built-in middleware to handle urlencoded form data
app.use(express_1.default.urlencoded({ extended: true }));
//* built-in middleware for json
app.use(express_1.default.json());
//* middleware for cookies
app.use((0, cookie_parser_1.default)());
/**
 * -------------- SESSION SETUP ----------------
 */
//** Initialize client.
var pgSession = (0, connect_pg_simple_1.default)(express_session_1.default);
//** Initialize store.
app.use((0, express_session_1.default)({
    store: new pgSession({
        pool: connectPG_js_1.pool,
        // createTableIfMissing: true,
        schemaName: "public",
        tableName: "session",
    }),
    genid: function (_req) {
        return (0, uuid_1.v4)();
    },
    name: "blog.sid",
    secret: "postgres-session",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000, secure: process.env.NODE_ENV === "production" ? true : false }
}));
/**
 * -------------- ROUTES ----------------
 */
app.get("^/$|index(.html)?", function (_req, res) {
    res.sendFile(node_path_1.default.join(__dirname + "/../client/build/index.html"));
});
var apiRoute = express_1.default.Router();
app.use("/api/v1", apiRoute);
app.use("/images", express_1.default.static(node_path_1.default.join(__dirname, "upload")));
apiRoute.use("", authRoute_js_1.default);
apiRoute.get("/posts", getPosts_js_1.default);
apiRoute.get("/user", getUser_js_1.default);
apiRoute.use(verifyToken_js_1.verifyToken);
apiRoute.post("/upload", upload_js_1.default.single("file"), uploadImage_js_1.default);
apiRoute.use("/posts", postRoute_js_1.default);
app.all('*', notFound_js_1.default);
app.use(errHandler_js_1.default);
app.listen(port, function () {
    console.log("Backend server is running on port ".concat(port));
});
