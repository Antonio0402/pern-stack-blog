import { Request, Response, NextFunction } from "express";
import * as jose from "jose";
import { query } from "../config/connectPG.js";
import { QueryResult } from "pg";
import { User } from "../model/user/user.model.js";


const handleLogout = async (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.session.user?.accessToken;
  if (accessToken && accessToken?.match(/\S+\.\S+\.\S+/) !== null) {
    try {
      const payload = jose.decodeJwt(accessToken);
      if (payload) {
        const user: QueryResult<User> = await query('SELECT * FROM public.user_profiles WHERE user_id = $1;', [payload.sub]);
        req.session.user = null;
        req.session.save(function (err) {
          if (err) next(err)

          // regenerate the session, which is good practice to help
          // guard against forms of session fixation
          req.session.regenerate(function (err) {
            if (err) next(err)
          })
        })
        if (!user.rows.length) {
          return res.sendStatus(204);
        }
        await query('UPDATE public.user_profiles SET refresh_token = $1 WHERE user_id = $2;', ['', user.rows[0].user_id]);
        return res.status(204).json({ "message": "You logged out successfully." })
      }
      return res.status(403).json("Token is not valid!");
    } catch (error) {
      next(error);
    }
  }
  return res.sendStatus(204);
}

export default handleLogout;