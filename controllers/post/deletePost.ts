import { Request, Response, NextFunction } from "express";
import { query } from "../../config/connectPG.js";

const deletePost = async (req: Request, res: Response, next: NextFunction) => {
  const user_id = req.user_id;
  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ 'message': 'Blog ID is required' })
  }
  try {
    const result = await query(`DELETE FROM public.blogs WHERE blog_id = $1 AND user_id = $2 RETURNING *;`, [id, user_id]);
    if (result.rows.length) {
      res.status(200).json('Post has been deleted successfully!');
    } else {
      res.status(403).json('You are only able to delete your own posts');
    }
  } catch (error) {
    next(error);
  }
}

export default deletePost;