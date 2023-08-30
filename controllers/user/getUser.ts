import { Request, Response, NextFunction } from "express";
import * as jose from "jose";
import { query } from "../../config/connectPG.js";
import { QueryResult } from "pg";
import { User } from "../../model/user/user.model.js";

const getUserById = async (req: Request, res: Response, next: NextFunction) => {

  const accessToken = req.session.user?.accessToken;
  if (accessToken && accessToken?.match(/\S+\.\S+\.\S+/) !== null) {
    try {
      const payload = jose.decodeJwt(accessToken);
      if (payload) {
        const result: QueryResult<User> = await query('SELECT * FROM public.user_profiles WHERE user_id = $1;', [payload.sub]);
        if (result.rows.length) {
          const { hashed_password, refresh_token, ...rest } = result.rows[0];
          return res.status(200).json({
            ...rest
          })
        }
        return res.status(204).json("No users found!");
      }
    } catch (error) {
      next(error);
    }
  } else {
    res.sendStatus(204);
  }
}

export default getUserById;