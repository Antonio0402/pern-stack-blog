import express from "express";
import getPost from "../controllers/post/getPost.js";
import updatePost from "../controllers/post/updatePost.js";
import createPost from "../controllers/post/createPost.js";
import deletePost from "../controllers/post/deletePost.js";
const postRoute = express.Router();

postRoute
  .post("/", createPost)
  .get("/:id", getPost)
  .delete("/:id", deletePost)
  .put("/:id", updatePost);

export default postRoute;