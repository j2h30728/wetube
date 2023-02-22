# 4 [2021 UPDATE] ROUTERS

## 4.0 What are Routers?

[Router](https://expressjs.com/ko/4x/api.html#router)
Router obejct는 isolated instance of middleware and routes 임.
"mini-application"이라고도 생각할 수 있음

모든 Express 애플리케이션에는 앱 라우터가 내장되어 있음
라우터는 미들웨어 자체처럼 작동하므로 `app.use()`에 대한 인수로 또는 다른 라우터의 `use()` 메서드에 대한 인수로 사용할 수 있습니다.
**최상위 익스프레스 객체에는 새로운 라우터 객체를 생성하는 Router() 메서드 존재**

라우터 객체를 만든 후, 미들웨어 및 HTTP 메서드 경로(ex: get, put, post 등)를 application처럼 추가할 수 있음

```js
// invoked for any requests passed to this router
// 이 라우터에 전달된 모든 요청에 대해 호출됨
router.use(function (req, res, next) {
  // .. some logic here .. like any other middleware
  next();
});

// will handle any request that ends in /events
// depends on where the router is "use()'d"
// "use() 'd"인 위치에 따라 '/events'로 끝나는 모든 요청을 처리함
router.get("/events", function (req, res, next) {
  // ..
});
```

경로를 파일 또는 mini-apps 으로 분리하는 방식으로 특정 루트 URL에 라우터를 사용할 수 있음

```js
// only requests to /calendar/* will be sent to our "router"
// '/calendar'에 대한 요청만 "router"로 요청됨
app.use("/calendar", router);
```

## 4.1 Making Our Routers

Summary:

1. Instead using `app.get([URL], [Handler])` to handle the request, we can create a router and let the router handle GET request.
   요청을 처리하기위해 app.get([URL], [Handler])를 사용하는 대신, 라우터를 생성하고 라우터가 GET요청을 처리 하도록 할 수 있음

2. Create app.use("/", homeRouter) - This way, when a user sends a GET request, the request gets routed to homeRouter.
   `app.use("/",homeRouter)` : 사용자가 GET요청을 보낼때 요청이 homeRouter로 라우팅됨

3. Then, create a constant variable called homeRouter as below:
   const homeRouter = express.Router()
   homeRouter라는 상수 변수 생성. `cons homeRouter = express.Router()`

4. Create a handler function as below:
   const handleReq = (req, res) => {res.send("Do something")}
   핸들러함수 생성 : `const handleReq = (req,res) => {res.send("Do something)}`

5. To connect the router to the handler use the code below:
   routerOne.get("/", handleReq);
   라우터를 핸들러에 연결 `homeRouter.get('/', handleReq)`

6. Then, users will get routed from the Express [app] to Router [homeRouter] to Handler function [handleReq] when users a request to get URL "/".
   사용자가 URL '/'가져오기 요청할 때 **`Express [app] => Router [homeRouter] => handler function [handleReq]`**으로 라우팅됨

## 4.2 Cleaning the Code

## 4.3 Exports

## 4.4 Router Recap

## 4.5 Architecture Recap

## 4.6 Planning Routes

## 4.7 URL Parameters part One

express는 위에서 아래로 요청을 해결하기 때문에 라우터의 경로에 따라 요청의 나열순서도 중요함

```js
import express from "express";
import { see, edit, upload, deleteVideo } from "../controllers/videoController";

const videoRouter = express.Router();

videoRouter.get("/upload", upload);
videoRouter.get("/:id", see); // 제일 상단에 있을경우, '/upload'로 진입했을 때도 upload를 변수로 인식해서 해당 라우터로 라우팅되어 id === upload가 됨
videoRouter.get("/:id/edit", edit);
videoRouter.get("/:id/delete", deleteVideo);

export default videoRouter;
```

## 4.8 URL Parameters part Two

[Routing](https://expressjs.com/ko/guide/routing.html)
라우팅은 application endpoint(URI)가 client 요청에 응답하는 방법을 나타냄
HTTP메서드에 해당하는 Express app object 메서드를 사용해서 라우팅을 정의함
app.get() => GET요청
app.pot() => POST요청
app.all() => 모든 HTTP메서드를 처리
app.use() => 미들웨어를 콜백함수로 지정할 수 있음

라우팅 방버은 application이 지정된 경로(endpoint)및 HTTP 메서드에 대한 요청을 수신할 때 호출 되는 콜백함수(handler function)를 지정함
app은 지정된 경로 및 메서드와 일치하는 요청을 "listen"하고 일치를 감지하면 지정된 콜백함수를 호출함

라우팅 메서들는 둘 이상의 콜백함수 인수로 가질 수 있음

1. 콜백 함수가 여러 개인 경우, 콜백 함수에 대한 인수로 next를 제공.
2. 다음 본문 내에서 next()를 호춣
3. 다음 콜백으로 제어권을 넘김

[**정규표현식 테스트 사이트**](https://www.regexpal.com)

- \w+: 모든 문자, 숫자 선택
  - `/(nico\w+)/g` : 'nico'를 포함한 모든 단어 (nico\_\_\_\_)
- \d+: 모든 숫자 선택
  - `/(\\d+)/g` : \ 뒤에는 숫자만 올 수 있음

```js
const videoRouter = express.Router();

// \\d 쓴 이유는 자바스크립트에서 \ 기호를 두번 써야지 인식하기 때문
videoRouter.get("/:id(\\d+)", see);
videoRouter.get("/:id(\\d+)/edit", edit);
videoRouter.get("/:id(\\d+)/delete", deleteVideo);
videoRouter.get("/upload", upload);
```

route path 예시

```js
app.get("/", (req, res) => {
  res.send("root");
});

app.get("/about", (req, res) => {
  res.send("about");
});

app.get("/random.text", (req, res) => {
  res.send("random.text");
});

//parameter
app.get("/users/:userId/books/:bookId", (req, res) => {
  res.send(req.params);
});
```

express 에서 함수표현식

```js
//b는 선택 - acd, abcd
app.get("/ab?cd", (req, res) => {
  res.send("ab?cd");
});

//b갯수는 1개이상 가능 - abcd, abbbbcd
app.get("/ab+cd", (req, res) => {
  res.send("ab+cd");
});

//ab와 cd 사이에 다른거 추가 가능 - abd,abecd,abdsfwefwcd, ab123cd
app.get("/ab*cd", (req, res) => {
  res.send("ab*cd");
});

//cd 선택 - abe , abcde
app.get("/ab(cd)?e", (req, res) => {
  res.send("ab(cd)?e");
});

//a를 포함
app.get(/a/, (req, res) => {
  res.send("/a/");
});

app.get(/.*fly$/, (req, res) => {
  res.send("/.*fly$/");
});
```
