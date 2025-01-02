import express from "express";
import {
  register,
  login,
  logout,
  updateProfile,
} from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/fileUpload.js";
const userRouter = express.Router();

userRouter.post("/register", singleUpload, register);
userRouter.post("/login", login);
userRouter.put("/profile/update", isAuthenticated, singleUpload, updateProfile);
userRouter.get("/logout", logout);

export default userRouter;
