import "./db";
import "./models/User";
import bodyParser from "body-parser";
import express from "express";
import { localsMiddleware } from "./middlewares";
import userRouter from "./userRouter";
import path from "path";
import session from "express-session";

const app = express();
app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "Hello!",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(localsMiddleware);
app.use("/", userRouter);

// Codesanbox does not need PORT :)
app.listen(4001, () => console.log(`✅  Server Ready!`));
