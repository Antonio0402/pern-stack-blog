import allowedOrigins from "./allowedOrigins.js";
import { NextFunction, Request, Response } from "express";

const credentials = async (req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Credentials", "true");
  }
  next();
}

export default credentials;