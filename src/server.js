import "./db";
//connect to mongo
import express from "express";
import morgan from "morgan";
import globalRouter from "./routers/globalRouter";
import videoRouter from "./routers/videoRouter";
import userRouter from "./routers/userRouter";

const app = express();
const PORT = 4000;

const logger = morgan();
app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(logger);
//여기 이 지점에는  request.body === undefined
app.use(express.urlencoded({ extended: true })); // application/x-www-form-urlencoded파싱 (form데이터 파싱) : 미들웨어는 라우터 전에 작성되어야함 (videoRouter을 겨냥)
// request.body 존재 하기 시작 - videoRouter에서 post 요청보낸 내용이 담겨져있음
app.use("/", globalRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);

const handleListening = () =>
  console.log(`✅ Server listenting on http://localhost:${PORT} 🚀`);

app.listen(PORT, handleListening);
