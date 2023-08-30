import { Request, Response, NextFunction } from "express";
import { query } from "../../config/connectPG.js";

const updatePost = async (req: Request, res: Response, next: NextFunction) => {
  const user_id = req.user_id;
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ 'message': 'Blog ID is required' })
  }
  const { title, content, img, cate } = req.body;
  try {
    const result = await query(`UPDATE public.blogs SET title = $1, content = $2, img = $3, cate = $4 WHERE blog_id = $5 AND user_id = $6`, [title, content, img, cate, id, user_id])
    if (result.rows.length) {
      res.status(201).json("Post has been updated successfully!")
    } else {
      res.status(204).json("No post found!");
    }
  } catch (error) {
    next(error);
  }
}

export default updatePost;