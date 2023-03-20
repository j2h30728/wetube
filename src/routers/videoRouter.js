import express from "express";
import {
  watch,
  getEdit,
  postEdit,
  deleteVideo,
  getUpload,
  postUpload,
} from "../controllers/videoController";
import { protectMiddleware } from "./middlewares";

const videoRouter = express.Router();

videoRouter.get("/:id([0-9a-f]{24})", watch);
videoRouter
  .route("/:id([0-9a-f]{24})/edit")
  .all(protectMiddleware)
  .get(getEdit)
  .post(postEdit); //get,post를 따로 쓰는 대신에, 하나의 경로만 필요로 하는 route사용
videoRouter
  .route("/:id([0-9a-f]{24})/delete")
  .all(protectMiddleware)
  .get(deleteVideo);
videoRouter
  .route("/upload")
  .all(protectMiddleware)
  .get(getUpload)
  .post(postUpload);

export default videoRouter;
