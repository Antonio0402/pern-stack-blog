import { NextFunction, Request, Response } from "express";
import { query } from "../../config/connectPG.js";
import { QueryResult } from "pg";
import { Blog } from "../../model/blog/blog.model.js";
import { User } from "../../model/user/user.model.js";

const getPost = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const result: QueryResult<Blog & User> = await query(`
    SELECT blog_id, username, title, content, img, pic, cate, date FROM public.user_profiles
    RIGHT JOIN public.blogs 
    USING (user_id)
    WHERE user_id = $1;`, [id]);
    if (result.rows.length) {
      res.status(200).json({
        data: result.rows[0]
      });
    } else {
      return res.status(204).json("No post found!");
    }
  } catch (error) {
    next(error);
  }
}

export default getPost;