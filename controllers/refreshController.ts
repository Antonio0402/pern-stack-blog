import { NextFunction, Request, Response } from "express";
import * as jose from "jose";
import { query } from "../config/connectPG.js";
import { signJwt } from "../middlewares/verifyToken.js";
import { QueryResult } from "pg";
import { User } from "../model/user/user.model.js";

const handleRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.session.user?.accessToken;
  if (accessToken && accessToken?.match(/\S+\.\S+\.\S+/) !== null) {
    try {
      const payload = jose.decodeJwt(accessToken);
      if (payload) {
        const result: QueryResult<User> = await query('SELECT * FROM public.user_profiles WHERE user_id = $1;', [payload.sub]);
        if (!result.rows.length) {
          return res.status(403).json("Refresh token is not valid!");
        }
        const user = result.rows[0];
        if (user.user_id !== payload.sub) return res.sendStatus(403);

        const newAccessToken = await signJwt({ "sub": user.user_id, "name": user.username, "role": "user" }, "access", "1h");
        const newRefreshToken = await signJwt({ "sub": user.user_id, "name": user.username, "role": "user" }, "refresh", "1d");

        await query('UPDATE public.user_profiles SET refresh_token = $1 WHERE user_id = $2;', [newRefreshToken, user.user_id]);

        req.session.user = { accessToken: newAccessToken };
        req.session.save(function (err) {
          // save the session before redirection to ensure page
          // load does not happen before session is saved
          if (err) next(err)
        });
        res.sendStatus(200);
      }
      return res.status(403).json("Token is not valid!");
    } catch (error) {
      next(error)
    }
  }
  return res.status(401).json("You are not authenticated!");
}

export default handleRefreshToken;