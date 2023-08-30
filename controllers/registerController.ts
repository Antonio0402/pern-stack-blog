import { NextFunction, Request, Response } from "express";
import { query } from "../config/connectPG.js";
import { bCryptGenPass } from "../middlewares/verifyToken.js";


const handleRegister = async (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ "message": "username and password are required!" });

  const isDuplicated = await query('SELECT * FROM public.user_profiles WHERE username = $1;', [username]);
  if (isDuplicated.rows.length) {
    return res.status(409).json({ message: `User with ${username} already exists!` });
  }

  try {
    const hashed_password = await bCryptGenPass(password);
    const newUser = await query('INSERT INTO public.user_profiles(username, hashed_password) VALUES($1, $2) RETURNING *;', [username, hashed_password]);
    if (newUser.rows.length) {
      res.status(201).json(`New user ${username} created successfully!`);
    } else {
      res.status(403).json(`Username must at least 3 letters and only contains alphabet letters`)
    }
  } catch (error) {
    next(error);
  }
}

export default handleRegister;