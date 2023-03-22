import express from "express";
import {
  logout,
  getEdit,
  postEdit,
  remove,
  see,
  startGithubLogin,
  finishGithubLogin,
  getChangePassword,
  postChangePassword,
} from "../controllers/userController";
import {
  protectMiddleware,
  publickOnlyMiddleware,
  uploadFiles,
} from "./middlewares";
import { multer } from "multer";

const userRouter = express.Router();

userRouter.get("/logout", protectMiddleware, logout);
userRouter
  .route("/edit")
  .all(protectMiddleware)
  .get(getEdit)
  .post(uploadFiles.single("avatar"), postEdit);
userRouter
  .route("/change-password")
  .all(protectMiddleware)
  .get(getChangePassword)
  .post(postChangePassword);
userRouter.get("/remove", remove);
userRouter.get("/github/start", publickOnlyMiddleware, startGithubLogin);
userRouter.get("/github/finish", publickOnlyMiddleware, finishGithubLogin); //github.com 에서 만든 url path
userRouter.get("/:id", see);

export default userRouter;
