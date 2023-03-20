import express from "express";
import {
  logout,
  getEdit,
  postEdit,
  remove,
  see,
  startGithubLogin,
  finishGithubLogin,
} from "../controllers/userController";
import { protectMiddleware, publickOnlyMiddleware } from "./middlewares";

const userRouter = express.Router();

userRouter.get("/logout", protectMiddleware, logout);
userRouter.route("/edit").all(protectMiddleware).get(getEdit).post(postEdit);
userRouter.get("/remove", remove);
userRouter.get("/github/start", publickOnlyMiddleware, startGithubLogin);
userRouter.get("/github/finish", publickOnlyMiddleware, finishGithubLogin); //github.com 에서 만든 url path
userRouter.get("/:id", see);

export default userRouter;
