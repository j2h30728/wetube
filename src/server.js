import express from "express";
import morgan from "morgan";
import rootRouter from "./routers/rootRouter";
import videoRouter from "./routers/videoRouter";
import userRouter from "./routers/userRouter";
import session from "express-session";
import { localsMiddleware } from "./routers/middlewares";
import MongoStore from "connect-mongo";
import apiRouter from "./routers/apiRouter";

const app = express();
const logger = morgan("dev");

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(logger);
//여기 이 지점에는  request.body === undefined
app.use(express.urlencoded({ extended: true })); // application/x-www-form-urlencoded파싱 (form데이터 파싱) : 미들웨어는 라우터 전에 작성되어야함 (videoRouter을 겨냥)
// request.body 존재 하기 시작 - videoRouter에서 post 요청보낸 내용이 담겨져있음

//Uncaught (in promise) ReferenceError: SharedArrayBuffer is not defined 오류 해결 방법
app.use((req, res, next) => {
  res.header("Cross-Origin-Embedder-Policy", "require-corp");
  res.header("Cross-Origin-Opener-Policy", "same-origin");
  next();
});
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false, // 세션이 수정되면 데이터베이스에 업데이트함
    saveUninitialized: false, // 세션이 초기화되면 데이터베이스에 저장함
    cookie: {
      maxAge: 20000000, //20000초 뒤에 쿠키가 만료됨 === 자동 로그아웃
    },
    store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
  })
);

app.use(localsMiddleware);
app.use("/uploads", express.static("uploads")); //uploads 폴더 접근을 허하노라
app.use("/static", express.static("assets")); //assets 폴더 접근을 허하노라, 이름이 서로 동일할 필요는 없음
app.use("/", rootRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);
app.use("/api", apiRouter);

export default app;
