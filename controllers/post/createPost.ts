import { NextFunction, Request, Response } from "express";
import { query } from "../../config/connectPG.js";
import { QueryResult } from "pg";
import { Blog } from "../../model/blog/blog.model.js";

const createPost = async (req: Request, res: Response, next: NextFunction) => {
  const user_id = req.user_id;
  const { title, content, img, cate } = req.body;
  try {
    const result: QueryResult<Blog> = await query(
      `INSERT INTO public.blogs(user_id, title, content, img, cate) VALUES($1, $2, $3, $4, $5) RETURNING *;`, [user_id, title, content, img, cate]
    )
    if (result.rows.length) {
      return res.status(201).json("Post has been creted successfully!");
    } return res.sendStatus(500);
  } catch (error) {
    next(error);
  }
}

export default createPost;