import express from "express";
import handleLogin from "../controllers/authController.js";
import handleRegister from "../controllers/registerController.js";
import handleLogout from "../controllers/logoutController.js";
import handleRefreshToken from "../controllers/refreshController.js";
const authRoute = express.Router();

authRoute
  .post("/login", handleLogin)
  .post("/register", handleRegister)
  .get("/refresh", handleRefreshToken)
  .post("/logout", handleLogout);

export default authRoute;