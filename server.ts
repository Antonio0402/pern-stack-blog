import express, { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import morgan from "morgan";
import cors from "cors";
import path from "node:path";
import * as dotenv from "dotenv";
import dotenvExpand from 'dotenv-expand';
// dotenvExpand.expand(dotenv.config({
//   path: process.env.NODE_ENV === "production"
//     ? "../../.env"
//     : "../.env"
// }));
dotenvExpand.expand(dotenv.config());
import assignId from "./middlewares/assignId.js";
import logger from "./middlewares/logger.js";
import credentials from "./config/credentials.js";
import helmet from "helmet";
import corsOptions from "./config/corsOptions.js";
import errHandler from "./middlewares/errHandler.js";
import notFound from "./config/notFound.js";
import expressSession from "express-session";
import cookieParser from "cookie-parser";
import connectPg from "connect-pg-simple";
import { pool } from "./config/connectPG.js";
import { verifyToken } from "./middlewares/verifyToken.js";
import authRoute from "./routes/authRoute.js";
import postRoute from "./routes/postRoute.js";
import getPosts from "./controllers/post/getPosts.js";
import getUserById from "./controllers/user/getUser.js";
import processImage from "./controllers/upload/uploadImage.js";
import upload from "./config/upload.js";
const __dirname = path.resolve();
/**
 * -------------- GENERAL SETUP ----------------
 */

const port = process.env.PORT || 5001;
const app = express();
// app.use(express.static(path.join(__dirname, "../client/dist")));

//* Creating new tokens for id and origin to set log format
morgan.token('id', function getId(req: Request) {
  return req.id
})
morgan.token('origin', function getOrigin(req: Request, _res: Response) { return req.headers.origin })

app.use(assignId);
app.use(morgan(':date[web] :id :method :origin :url', {
  stream: await logger("reqLog.txt")
}));

//* Handle options credentials check - before CORS
//* and fetch cookies credentials requirement
app.use(credentials);

app.use(helmet({
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
app.use(cors(corsOptions));

//* built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: true }));

//* built-in middleware for json
app.use(express.json());

//* middleware for cookies
app.use(cookieParser());



/**
 * -------------- SESSION SETUP ----------------
 */

//** Initialize client.
const pgSession = connectPg(expressSession)

//** Initialize store.
app.use(expressSession({
  store: new pgSession({
    pool,
    createTableIfMissing: true,
    schemaName: "public",
    tableName: "session",
  }),
  genid: function (_req) {
    return uuidv4()
  },
  name: "blog.sid",
  secret: "postgres-session",
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000, secure: process.env.NODE_ENV === "production" ? true : false, sameSite: "none" }
}))

/**
 * -------------- ROUTES ----------------
 */

// app.get("^/$|index(.html)?", (_req, res) => {
//   res.sendFile(path.join(__dirname, "../client/dist/index.html"))
// })

const apiRoute = express.Router();
app.use("/api/v1", apiRoute)
app.use("/images", express.static(path.join(__dirname, "upload")))
apiRoute.use("", authRoute);
apiRoute.get("/posts", getPosts);
apiRoute.get("/user", getUserById);
apiRoute.use(verifyToken);
apiRoute.post("/upload", upload.single("file"), processImage)
apiRoute.use("/posts", postRoute);

app.all('*', notFound);
app.use(errHandler);

app.listen(port, () => {
  console.log(`Backend server is running on port ${port}`)
})