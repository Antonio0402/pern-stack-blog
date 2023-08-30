import { NextFunction, Request, Response } from "express";
import { query } from "../../config/connectPG.js";
import { QueryResult } from "pg";
import { Blog } from "../../model/blog/blog.model.js";

const getPosts = async (req: Request, res: Response, next: NextFunction) => {
  const { cate } = req.query;
  try {
    const result: QueryResult<Blog> = cate
      ? await query(`SELECT * FROM public.blogs WHERE cate = $1`, [cate])
      : await query(`SELECT * FROM public.blogs`);
    res.status(200).json({ data: result.rows })
  } catch (error) {
    next(error);
  }
}

export default getPosts;