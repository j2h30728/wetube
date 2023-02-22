import express from "express";
import { users, edit, see } from "../controllers/userController";

const userRouter = express.Router();

userRouter.get("/", users);
userRouter.get("/edit-profile", edit);
userRouter.get("/:id", see);

export default userRouter;
