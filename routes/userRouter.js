import express from "express";
const userRouter = express.Router();
import checkAuth from "./../middleware/checkAuth.js";
import {
  newUser,
  authUser,
  confirmAuth,
  forgotPassword,
  verifyToken,
  NewPassword,
  profile,
} from "../controllers/userController.js";

userRouter.post("/", newUser);
userRouter.post("/login", authUser);
userRouter.get("/confirm/:token", confirmAuth);
userRouter.post("/forgot-password", forgotPassword);
userRouter.get("/forgot-password/:token", verifyToken);
userRouter.post("/forgot-password/:token", NewPassword);
userRouter.get("/profile", checkAuth, profile);

export default userRouter;
