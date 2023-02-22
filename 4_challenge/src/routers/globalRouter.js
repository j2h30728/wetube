import express from "express";
import { join, login } from "../controllers/userController";
import { home, trending, updated } from "../controllers/storyController";

const globalRouter = express.Router();

globalRouter.get("/", home);
globalRouter.get("/trending", trending);
globalRouter.get("/new", updated);
globalRouter.get("/join", join);
globalRouter.get("/login", login);

export default globalRouter;
