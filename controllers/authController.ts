import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import { signJwt } from "../middlewares/verifyToken.js";
import { query } from "../config/connectPG.js";
import { QueryResult } from "pg";
import { User } from "../model/user/user.model.js";

const handleLogin = async (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ "message": "Username and Password are required!" });
  try {
    const result: QueryResult<User> = await query('SELECT * FROM public.user_profiles WHERE username = $1;', [username]);
    const user = result.rows[0];
    if (!user) {
      return res.status(401).json(`User is not found with username: ${username}`)
    }
    const isValid = await bcrypt.compare(password, user.hashed_password);
    if (!isValid) {
      return res.status(401).json('Incorrect password')
    }
    const accessToken = await signJwt({ "sub": user.user_id, "name": user.username, "role": "user" }, "access", "1h");
    const refreshToken = await signJwt({ "sub": user.user_id, "name": user.username, "role": "user" }, "refresh", "1d");
    req.session.regenerate(function (err) {
      if (err) next(err)

      // store user information in session, typically a user id
      req.session.user = { accessToken };

      // save the session before redirection to ensure page
      // load does not happen before session is saved
      req.session.save(function (err) {
        if (err) return next(err)
      })
    });
    const updateRefreshToken = await query('UPDATE public.user_profiles SET refresh_token = $1 WHERE user_id = $2 RETURNING *;', [refreshToken, user.user_id]);

    if (updateRefreshToken.rows.length) {
      res.status(200).json("You are authenticated")
    }
  } catch (error) {
    next(error);
  }
}

export default handleLogin;