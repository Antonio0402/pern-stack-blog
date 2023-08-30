import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import * as crypto from "node:crypto";
import * as jose from "jose";
import { pubAccessKey, privAccessKey, privRefreshKey } from "../config/getKeys.js";

const saltRounds = 10;
const ALGORITHM = "RS256";

const CLIENT_ORIGIN_URL = process.env.NODE_ENV === "production"
  ? "https://fullstack-blog-client.onrender.com"
  : "http://localhost:4040";
const SERVER_ORIGIN_URL = process.env.NODE_ENV === "production"
  ? "https://fullstack-blog-api.onrender.com/api/v1"
  : "http://localhost:5001/api/v1";

export async function bCryptGenPass(password: string) {
  const salt = await bcrypt.genSalt(saltRounds)
  const hash = await bcrypt.hash(password, salt)
  return hash
}

export const signJwt = async (payload: any, kindOf: "access" | "refresh", expire: string) => {
  const PRIV_KEY = kindOf === "access"
    ? crypto.createPrivateKey(privAccessKey)
    : crypto.createPrivateKey(privRefreshKey)
  return await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: ALGORITHM })
    .setIssuer(SERVER_ORIGIN_URL)
    .setAudience(CLIENT_ORIGIN_URL)
    .setIssuedAt()
    .setExpirationTime(expire)
    .sign(PRIV_KEY)
}

const verifyJwt = async (jwt: string, publicKey: Buffer) => {
  const PUB_KEY = crypto.createPublicKey(publicKey);
  return await jose.jwtVerify(jwt, PUB_KEY, {
    issuer: SERVER_ORIGIN_URL,
    audience: CLIENT_ORIGIN_URL,
    algorithms: [ALGORITHM]
  })
}

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.session.user?.accessToken;
  if (accessToken && accessToken?.match(/\S+\.\S+\.\S+/) !== null) {
    try {
      const { payload } = await verifyJwt(accessToken, pubAccessKey);
      if (payload) {
        req.user_id = payload?.sub;
      }
      next();
    } catch (error) {
      res.status(403).json("Token is not valid!");
    }
  } else {
    res.status(401).json("You are not authenticated!")
  }
}