# 3 INTRODUCTION TO EXPRESS

## 3.0 Your First Server

1.  src 폴더 생성 : 모든 application들을 저장함 (코드와 로지을 가지고있는 모든파일)
2.  index.js -> server.js 파일 변경

    ```json
    "scripts": {
        "dev": "nodemon --exec babel-node src/server.js"
    },
    ```

3.  server.js

    ```js
    import express from "express"; // babel로 사용가능 해진 최신문법
    const app = express(); //express application 생성
    ```

### server

app이 listen 해야한다. => listen이 뭘까?
**서버 :**
서버는 request를 listeng하는 항상 켜져있는 컴퓨터. (24내내 온라인에 연결된 컴퓨터.)\_A server is a computer listening for requests.
사람들이 무엇을 할지 기다림
서버와 상호작용하는 것

- request : 내가 보내는 요청.(카카오톡 메시지를 보냄)
- listen : 내요청을 서버가 듣는것.(나->서버, 서버->나)

```js
import express from "express"; // babel로 사용가능 해진 최신문법

const PORT = 4000;
const app = express(); //express application 생성

const handleistening = () =>
  console.log(`Server listening on port http://localhost:${PORT}`);

app.listen(PORT, handleistening);
// app.listen(portnumber,"서버가 시작될 때 작동하는 콜백 함수 : 어떤 port를 listeng할지 얘기해줌")
//서버가 만들어지고 서버가 port 4000을 listening하고 있음
```

## 3.1 GET Requests

#### 서버가 request에 respond하도록 하는 법

**cannot GET /**
/ : 서버의 root, 홈페이지
GET : HTTL method - "저 페이지를 가져다 줘"
입력한 주소로 접속하면, 브라우저가 자동으로 해당되는 페이지를 get하려 함

##### HTTP

우리가 서버와 소통하는 방법 / 서버가 서로 소통하는 방법 / 많은 방법중하나
유저가 원하는 웹페이지에 접속할때, http request를 만들어 보냄
(사실, 브라우저가 대신해서 http request를 만들어 줌 :"ㅇㅇ홈페이지 가져다 줘)
When we go to google.com with our browser what kind of request are we making? => GET request

**http requset** : 웹사이트에 접속하고 서버에 정보를 보내는 방법

> **Summary:**
>
> 1.  Once you create a server, you need to make server respond to user requests.
> 2.  Users request using HTTP protocol. This request is called GET request.
> 3.  When they type in the URL in the address bar and the page loads, they are actually **sending a GET request to a server, getting a response and displaying a response on the browser.**

## 3.2 GET Requests part Two

#### 서버에게, get request에 어떻게 응답하는 방법

express application이 만들고 코드를 작성해야함

request : 유저가 뭔가를 요청하거나 보내거나, 내게 무슨행동을 함
(GET / :브라우저가 홈페이지를 request )
reponsd :

> **Summary:**
>
> 1.  In order to make a server respond to a GET request from a user's browser, set up .get() that takes in a "home URL" and "eventHandler function" as below:
>     const handleHome = () => console.log("Somebody is trying to go home.");
>     app.get("/", handleHome);
> 2.  Having these codes in a server.js (has to placed after express server initiates), it will know how to respond to GET requests from users. However, since EventHandler does not return anything, it will keep the browser loading, waiting for a response from the server.

## 3.3 Responses

#### router를 다루는 방법

express 에서 route handler에는 request object, respond object 존재
`app.get("/", (req Object, res Object, next Fn) => {}) `
여기서의 requset, respond는 express로부터 받은 것

- **route handler** : 사용자가 원하는 path(URL)에 접속할때 실행 되는 콜백함수
- **request object** : 사용자가 만든 HTTP request에 대한 정보(Information about the request the user is making.)
- **reseponse object** : HTTP request을 받을때 사용자에게 응답할 HTTP Response(Functions to respond to the user.)

```js
const handleHome = (req, res) => {
  //   return res.end(); // request를 종료시킴 - 더이상 로딩되지않음: 서버는 브라우저에게 아무것도 보내지않음
  return res.send("I still love"); // 또다른 방법, ("") 안에 메시지도 넣을 수 있음
};
```

```js
const app = express(); //express application 생성

const handleHome = (req, res) => {
  return res.send("I still love");
};
const handleLogin = (req, res) => {
  return res.send("Login here.");
};

app.get("/", handleHome); // root page
app.get("/login", handleLogin); // /login page
```

Summary:

1. Though setting up .get("URL", "GET handler function") will handle a Get request, it will not respond to a GET reqeust.
2. In order to make a server respond to a user's GET request, you need to modify the EventHandler function into an arrow function. Then, make the response argument .end() or .send() as below:
   const handleHome = (req, res) => {
   return res.send("I still love you.");
   };
3. The _first argument_ inside GET handler function is usually named "req," it takes in a _request object_.
4. The _second argument_ is usually named "res," and it takes in a _response object_.
5. res.end() will end the response without returning anything; res.send() will return an input to the user's browser. For this particular example, the user will see a string "I still love you." on their browser when they request for a home ("/") URL page to a server.

## 3.4 Recap

#### [Express](https://expressjs.com/ko/4x/api.html#express.json%20[%20express%20document%20])

**app.get(path, callback [, callback ...])**
지정된 콜백 함수를 사용하여 HTTP GET 요청을 지정된 경로로 라우팅함

**Request**
req 객체는 HTTP request를 나타냄
요청 query string, parameters, body, HTTP headers 등에 대한 속성을 가지고 있음

**Response**
res 객체는 Express 앱이 HTTP request를 받을 때 보내는 HTTP response를 나타냄

**Day2 코드 챌린지**

```js
import express from "express";

const app = express();
const PORT = 4000;

app.get("/", (req, res) => res.send("<h1>Here is root</h1>"));
app.get("/about", (req, res) => res.send("<h1>Here is about</h1>"));
app.get("/contact", (req, res) => res.send("<h1>Here is contact</h1>"));
app.get("/login", (req, res) => res.send("<h1>Here is login</h1>"));

app.listen(PORT, () => console.log(`server is opened at ${PORT} port`));
```

## 3.5 Middlewares part One

#### Middleware

##### app.get(path, ...handler)

미들웨어 : 중간에 있는 소프트웨어
브라우저가 뭔가를 request하면, 서버가 거기에 response(응답)을 해준다.
-> middleware는 request와 response사이에 존재(A function that runs between the request and the response to the user.)
모든 middleware는 handler이며, contorlloer임

`app.get("/", comtroller:handleHome)`
`const handleHome = (req,res,next) => next()` : 세번째 argument에는 next function존재 - 다음 middleware 실행

```js
const gossipMiddleware = (req, res, next) => {
  console.log("I'm in the middle!. I'm middleware");
  // return res.send() // 이 문구가 존재하면 next() 실행 안함.
  next(); //next를 호출하면 middlware 임. (아닐경우도 존재하긴함)
};
const handleHome = (req, res) => {
  return res.send("I'm finalware ");
};
const handleLogin = (req, res) => {
  return res.send("Login here.");
};
app.get("/", gossipMiddleware, handleHome); // app.get(path, ...handleer)
```

`app.get(path, ...handleer)` : 여러 미들웨어 추가가능
**finalware**
마지막에 호출되어 종료되는 controller는 세번째 argument인 next가 필요없음

```js
const handleHome = (req, res) => {
  return res.send("I'm finalware ");
};
```

req가 requset에 관한 정보를 가지고있는 object

```js
const gossipMiddleware = (req, res, next) => {
  console.log(`Someone is going to ${req.url}`); // Someone is going too /
  next();
};
```

Summary:

1. Middlewares are software between request and response.
2. All middlewares are handlers. All controllers are middlewares.
3. They have three arguments including next argument. (req, res, next)
4. Next argument calls [next()] the next handler function if it exists.
   For example, consider below code and comments:

```js
// though it starts with middleware "one" it will eventually end up with a controller "three" because next() was called.
// You can put codes inside a body of middlewares "one" and "two" to check something before they get to the controller "three"
const one = (req, res, next) => {
  next();
};
const two = (req, res, next) => {
  next();
};
const three = (req, res) => {
  console.log("Now three is handling");
};

// app.get will handle users who visit "/" URL with "one" handler
app.get("/", one, two, three);
```

## 3.6 Middlewares part Two

#### app.use(middleware)

global middlware를 만들 수 있게 해줌
어느 URL에도 작동하는 middlware(== 모든 route에 적용됨)
순서를 조심해야함 : middleware를 use => URL의 get 순서

```js
const gossipMiddleware = (req, res, next) => {
  console.log(`Someone is going to ${req.url}`);
  next();
};
const handleHome = (req, res) => {
  return res.send("I love middleware");
};
app.use(gossipMiddleware);
app.get("/", handleHome);
```

어느 path를 가도 동작
path: "/" => Someone is going to /
path: "/test" => Someone is going to /test

```js
const logger = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
};
const privateMiddleware = (req, res, next) => {
  const url = req.url;
  if (url === "/protected") {
    return res.send("<h1>Not Allowed</h1>"); // /protected 경로로 접근시, 멈추고 종료됨
  }
  console.log("Allowed, you may continue");
  next();
};
const handleHome = (req, res) => {
  return res.send("I love middleware");
};
const handleProtected = (req, res) => {
  return res.send("Welcome to the private lounge.");
};
app.use(logger);
app.use(privateMiddleware); // 위에서 아래로 순서대로 실행하다, "/protected"경로 진입시 여기서 멈추고 종료됨
app.get("/", handleHome);
app.get("/protected", handleProtected);
```

- 특정 하나의 route만 실행되는 미들웨어 : `app.get("/", myMiddleware, myHandler)`

## 3.7 Setup Recap

## 3.8 Servers Recap

#### Server

서버는 인터넷에 연결되어 있으며 24시간 꺼지지 않는 컴퓨터
서버는 클라이언트(여기서는 브라우저)에서 보낸 request 를 받고 response 보냄

## 3.9 Controllers Recap

#### Request, Response

클라이언트와 서버는 개방된 포트를 통해 request 와 response 를 주고받음
서버는 request 를 받으면 반드시 response 를 해주어야 함. 브라우저 무한 로딩이 될 수 있기 때문.
HTTP request 는 어떤 route(url) 에 대한 HTTP Method 요청이고 서버는 그 요청에 대한 response 를 해주어야 함. 여기서 중요한 것이 또 **controller**이다.

- [requset](https://expressjs.com/en/4x/api.html#req) : url, cookies, 브라우저 정보, ip etc.
- [response](https://expressjs.com/en/4x/api.html#res) : send("message")\_message보내기 , end()\_연결종료 , cookie()\_쿠키설정, json(), redirect() etc.

##### controller

컨트롤러는 전달받은 request를 처리하고 response를 전달하기 위한 콜백함수임(==handler)

**function** : `() => {console.log("function")}` \_inline function
**statement** : `console.log("statement")` , `1+1` etc

## 3.10 Middleware Recap

#### Middleware

미들웨어는 컨트롤러가 request 처리 작업을 완료하고 response 를 전달하기 전에 request 처리를 도와주는 콜백함수
미들웨어는 request object, response object, next function 파라미터를 가짐
next 파라미터는 다음으로 request 를 처리할 콜백함수임
어떤 controller가 response될 때까지 requset에 관련된 모든 controller가 middlware임. 마지막 controller가 reponse할 것.
관습적으로 응답해주는 마지막 controller에는 next 를 쓰지않음. 사용하지 않기 때문.(request,response 는 필수로 써주기!)

미들웨어가 항상 next() 함수를 사용하는 것은 아님

```js
const methodLogger = (req, res, next) => {
  console.log(`method ${req.method}`); // method GET
  next();
};
const routerLogger = (req, res, next) => {
  console.log(`PATH ${req.path}`); // PATH /
  next();
};
const handleHome = (req, res) => {
  return res.send("I love middleware");
};
const handleLogin = (req, res) => {
  return res.send("login");
};
```

동일한 두개의 코드

```js
//1. app.get만 사용
app.get("/", methodLogger, routerLogger, handleHome);
app.get("/login", methodLogger, routerLogger, handleLogin);

//2. app.use 사용
app.use(methodLogger, routerLogger);
app.get("/", handleHome);
app.get("/login", handleLogin);
```

## 3.11 External Middlewares

[Morgan](https://www.npmjs.com/package/morgan)
NodeJS를 위한 HTTP request logger
`npm i morgan`

[Morgan사용법](https://www.npmjs.com/package/morgan#examples)

skip을 사용해서 특정 statusCode만 필터 가능

```js
import morgan from "morgan";
const logger = morgan();
app.use(logger);
```

=>::1 - - [Thu, 16 Feb 2023 04:27:15 GMT] "GET / HTTP/1.1" 200 17 "-" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36"

```js
// EXAMPLE: only log error responses
morgan("combined", {
  skip: function (req, res) {
    return res.statusCode < 400;
  },
});
```

#### [Day3 wetube 챌린지](https://codesandbox.io/s/day3-wetube-f93b9c?file=/src/server.js:0-761)

Tasks
미들웨어 4개를 만드세요.

- [x] URL Logger: 이 미들웨어는 방문 중인 URL을 기록(log) 해야 합니다.
- [x] Time Logger: 이 미들웨어는 요청(request)의 년, 월, 일을 기록해야 합니다.
- [x] Security Logger: 이 미들웨어는 프로토콜이 https이면 secure이라고 기록하고, 그 외의 경우 insecure라고 기록해야 합니다.
- [x] Protector Middleware: 이 미들웨어는 사용자가 /protected로 이동하려고 할 경우 이동하지 못하도록 해야 합니다.
