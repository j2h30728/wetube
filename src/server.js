import express from "express";
import morgan from "morgan";
import globalRouter from "./routers/golbalRouter";
import videoRouter from "./routers/videoRouter";
import userRouter from "./routers/userRouter";

const app = express();
const PORT = 4000;

const logger = morgan();

app.use(logger);

app.use("/", globalRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);

app.listen(PORT, () => console.log(`sercer listen ${PORT}`));
