# 6 MONGODB AND MONGOOSE

## 6.0 Array Database part One

`req.params.id`

```js
export const see = (req, res) => {
  const { id } = req.params;
  const video = videos[id - 1];
  return res.render("watch", { pageTitle: `Watching ${video.title}` });
};
```

```pug
mixin video(info)
  div
    h4
      a(href=`videos/${info.id}`)= info.title
    ul
      li #{ info.rating }/5.
      li #{ info.comments } comments.
      li Posted #{ info.createdAt }.
      li #{ info.views } views.
```

## 6.1 Array Database part Two

#### absolute URL , relative URL

1. absolut URL :`/`부터 작성해서 절대경로 부터 시작
   `href='/videos/123/edit`
2. relative URL : 현재의 url 경로에서 이동
   `href='edit'`

## 6.2 Edit Video part One

#### POST , GET

```js
//videoControllers.js
export const watch = (req, res) => {
  const { id } = req.params;
  const video = videos[id - 1];
  return res.render("watch", { pageTitle: `Watching ${video.title}`, video });
};
export const edit = (req, res) => {
  const { id } = req.params;
  const video = videos[id - 1];
  return res.render("edit", { pageTitle: "Edit", video });
};
```

```pug
//watch.pug
extends base.pug

block content
  h3 #{ video.views } #{ video.views === 1 ? "view" : "views" }
  a(href=`${video.id}/edit`) Edit Video &rarr;
```

form 태그의 기본 기능은 GET 임

```pug
//edit.pug
extends base.pug

block content
  h4 Change Title of video

  form(action="testing-change", methdo="GET")
    input(name="title", placeholder="Video Title", value=video.title, required)
    input(value="Save", type="Submit")
```

위의 코드를 가진 form에서 값을 입력후 submit하게되면
아래의 링크로 이동하며 action프로퍼티 값으로 get요청을 보냄
(`form(action="testing-change" method="GET")` 와 동일함)
: form에 있는 정보가 url 로 들어감
`form(method="POST", action="/videos/otherurl")` : action 을 사용해 다른 url로 post 요청 가능

```
http://localhost:4000/videos/2/testing-change?title=testInputValue
Cannot GET /videos/2/testing-change

```

POST 요청으로 보내는 form

```pug
extends base.pug

block content
  h4 Change Title of video

  form(method="POST")
    input(name="title", placeholder="Video Title", value=video.title, required)
    input(value="Save", type="Submit")
```

```
http://localhost:4000/videos/2/edit
Cannot POST /videos/2/edit
```

edit post Router, Controller 추가

```js
//videoRouter.js
videoRouter.get("/:id(\\d+)/edit", getEdit);
videoRouter.post("/:id(\\d+)/edit", postEdit);

//videoController.js
export const getEdit = (req, res) => {
  const { id } = req.params;
  const video = videos[id - 1];
  return res.render("edit", { pageTitle: "Edit", video });
};
export const postEdit = (req, res) => {};
```

## 6.3 Edit Video part Two

#### [req.body](https://expressjs.com/ko/api.html#req.body)

`req.body`에는 `form`을 통해 `submit`된 데이터의 키-값 쌍을 포함함
기본적으로는 `undefined`이며 **`express.json()`** 또는 **`express.urlencoded()`**와 같은 바디 파싱 미들웨어를 사용할 때 값을 받아옴

```js
// 애플리케이션/json 파싱
app.use(express.json());
// application/x-www-form-urlencoded파싱 (form데이터 파싱)
// form 을 우리가 사용할 수있는 javascript object형식을 통역해줌
app.use(express.urlencoded({ extended: true }));
```

##### [`express.urlencoded([options])`](https://expressjs.com/ko/api.html#express.urlencoded)

Express에 내장된 미들웨어 기능
urlencoded 페이로드로 들어오는 요청을 구문 분석하고 바디 파서를 기반으로 함

##### route

get,post를 따로 쓰는 대신에, 하나의 경로만 필요로 하는 route사용
2개 이상의 method를 사용할 때 사용하는것이 용이

```js
//이전
videoRouter.get("/:id(\\d+)/edit", getEdit);
videoRouter.post("/:id(\\d+)/edit", postEdit);

//이후
videoRouter.route("/:id(\\d+)/edit").get(getEdit).post(postEdit);
```

POST 요청을 진행하고 watch 라우트로 리다이렉트
POST : back end로 데이터를 보냄

```js
export const postEdit = (req, res) => {
  const { id } = req.params; // 해당 id 값을 가져옴
  const title = req.body.title; // forn 에 입력한 값을 가져옴
  videos[id - 1].title = title; // form 에 입력한 값으로 title 수정
  return res.redirect(`/videos/${id}`); // 수정후, 해당 id의 watch route로 이동
};
```

## 6.4 Recap

input 에서 name 을 빠뜨리고 post 요청 보내면 req.body에서 데이터를 볼 수 없음

## 6.5 More Practice part One

## 6.6 More Practice part Two

```pug
extends base.pug

block content
  form(method="POST")
    input(name="title", type="text", required, placeholder="Title")
    input(type="submit", value="Upload Video")
```

**`postUpload` Controller**
두 경로로 이동

1. post request로 '/vidoes/upload/로 감
2. get request로 홈페이지인 '/' 감

```js
export const postUpload = (req, res) => {
  // here we will add a video to the videos array.
  return res.redirect("/");
};
```

## 6.7 Introduction to MongoDB

[MongoDB 다운로드 사이트](https://docs.mongodb.com/manual/installation)

[MongoDB 설치 (MacOS용)](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/)
터미널에서 아래와 같이 입력하시면 됩니다.

1. xcode-select --install

2. brew tap mongodb/brew
   (Homebrew 설치가 안 되있으면 설치 필요)

3. brew install mongodb-community@5.0
   (버전은 추후에 달라질 수 있습니다.)

[MongoDB Compass (MongoDB GUI)](https://www.mongodb.com/products/compass)

## 6.8 Connecting to Mongo

node.js에서 mongoDB와 상호작용하기 위해 mongoose사용하는 것
(자바스트립트 코드를 mongoose가 mongoDB에게 전달해줌)

`mongosh
show dbs`

### mongoose 설치

`npm i mongoose`

`mongoose.connect("mongodb://127.0.0.1:27017/**만들고 싶은 데이터베이스 이름**")

mongo를 연결함

```js
import "./db";
```

데이터데이스(몽고)연결 세팅. 성공할 경우와 실패한 경우.
`db.on('event', event가 일어나면 실행시킬 콜백함수)`

```js
//db.js
import mongoose from "mongoose";

mongoose.set("strictQuery", false);
mongoose.connect("mongodb://127.0.0.1:27017/wetube", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
const handleOpen = () => console.log("✅ Connected to DB");
const handleError = error => console.log("❌ DB Error", error);

db.on("error", handleError); // error가 발생할 때 마다 실행됨
db.once("open", handleOpen); // 서버가 연결될 때 딱 한번 실행됨
```

---

macOS

`MongoDB shell version v5.0.0
connecting to: mongodb://127.0.0.1:27017/?compressors=disabled&gssapiServiceName=mongodb
Error: couldn't connect to server 127.0.0.1:27017, connection attempt failed: SocketException: Error connecting to 127.0.0.1:27017 :: caused by :: Connection refused :
connect@src/mongo/shell/mongo.js:372:17
@(connect):2:6
exception: connect failed
exiting with code 1
-----------------------------------`
이렇게 뜨면
M1: `mongod --config /opt/homebrew/etc/mongod.conf --fork`

**mongod**: MongoDB 시스템의 기본 데몬 프로세서 (서버와 같은 느낌)
**mongosh**: MongoDB에 대한 쉘 인터페이스 (클라이언트 같은 느낌) = mongoDB와 상호작용가능

mongod로 서버를 키고 -> mongo로 인터페이스를 실행하여 mongoDB와 소통g함

출처 : https://stackoverflow.com/questions/31981857/what-are-the-practical-differences-between-mongo-and-mongod

## 6.9 CRUD Introduction

데이터베이스에게 데이터가 어떻게 생겼는지 알려줘야함 => 타입선언과 같음

## 6.10 Video Model

#### Schema

[Schemas](https://mongoosejs.com/docs/guide.html#schemas)
몽구스의 모든 것은 스키마로 시작
각 스키마는 MongoDB 컬렉션에 매핑되고 해당 컬렉션 내 문서의 모양을 정의함

모델의 생김새(shape)를 알려줌

```js
import mongoose from "mongoose";
const { Schema } = mongoose;

const blogSchema = new Schema({
  title: String, // String is shorthand for {type: String} 동일함
  author: String,
  body: String,
  comments: [{ body: String, date: Date }],
  date: { type: Date, default: Date.now },
  hidden: Boolean,
  meta: {
    votes: Number,
    favs: Number,
  },
});
```

#### Mdoels

[Models](https://mongoosejs.com/docs/guide.html#models)
[Models](https://mongoosejs.com/docs/models.html)
db를 mongoose와 연결시켜서 video model을 인식시킴
스키마 정의(Schema definition)을 사용하려면 작업할수있는 modeal 로 변환해야함
`const Blog = mongoose.model('Blog',blogSchema);`
`mongoose.model(
  '모델의 대상인 컬렉션의 단일 이름:몽구스가 자동으로 모델이름을 복수 소문자 버전으로 변환',
  생성한 스키마)`를 호출하면 mongoose가 모델을 컴파일함

`mongoose.model(modelName, schema)`:
모델은 스키마 정의에서 컴파일된 멋진 생성자
모델의 인스턴스를 document라고 함
모델은 기본 MongoDB 데이터베이스에서 문서를 만들고 읽음

```js
import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  title: String,
  description: String,
  createdAt: Date,
  hashtags: [{ type: String }],
  meta: {
    views: Number,
    rating: Number,
  },
});

const Video = mongoose.model("Video", videoSchema);
export default Video;
```

## 6.11 Our First Query

```js
// models/video.js
const Video = mongoose.model("Video", videoSchema);
export default Video;
```

Video model을 default로 export한 뒤,
import 해서 preload를 가능하게 만듬.
model을 미리 complie 또는 create 해야지 우리가 필요 할 때 해당 model을 사용할 수 있음

```js
//server.js
import "./db"; //connect to mongo
import "./models/video";

/*....*/
import "./models/Users";
import "./models/Comments";
```

위와 같이 계속 반복되게 import를 할경우, 쓸데없는 코드만 늘어남.
또한, import는 server와 관련이 없음

파일을 따로 만들어서 해당 형식의 import 들을 분리해 따로 관리함

1. server.js : 서버 구축. 서버객체를 만듬
   1. app객체에 직접 get,post,put,delete함수를 사용하여 HTTPmethod로 라우팅할수있음
   2. 라우팅 : 웹 프레임워크는 HTT요청을 분기하는 방법을 제공. HTTP요청 URL에 해당하는 **알맞은 응답의 경로를 미리 설정**

```js
import express from "express";
import morgan from "morgan";
import globalRouter from "./routers/globalRouter";
import videoRouter from "./routers/videoRouter";
import userRouter from "./routers/userRouter";

const app = express();
const logger = morgan();
app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(logger);
app.use(express.urlencoded({ extended: true })); /
app.use("/", globalRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);

export default app;
```

2. init.js : 원하는 포트로 열어 서버를 시작함(연결함)
   1. app.lesten(서버를 오픈할 포트 번호, 서버오픈시 실행할 콜백함수) : 원하는 포트에 서버를 오픈
   2. 포트 : 외부와 통신할 수 있는 구멍으로, 원하는 포트로 코드작성시 외부 컴퓨터가 해당 포트로(아이피주서:포트번호)로 들어올 수 있음

```js
import "./db"; //connect to mongo
import "./models/video";
import app from "./server";

const PORT = 4000;

const handleListening = () =>
  console.log(`✅ Server listenting on http://localhost:${PORT} 🚀`);

app.listen(PORT, handleListening);
```

3. 포트를 연결해서 서버를 여는 함수가 init.js로 이동했기때문에 package.json 코드 변경

```json
  "scripts": {
    "dev": "nodemon --exec babel-node src/init.js"
  },
```

## 6.12 Our First Query part Two

nodeJS는 비동기로 작업되기 때문에 코드작성 순서가 먼저였더하더라고 결과는 순서대로 나오지않음

```js
import Video from "../models/Video";

export const home = (req, res) => {
  console.log("Start");
  Video.find({}, (error, videos) => {
    console.log("Finished");
    return res.render("home", { pageTitle: "Home", videos });
  });
  console.log("I finish first");
};
```

결과 :

> ✅ Server listenting on http://localhost:4000 🚀
> ✅ Connected to DB
> Start
> I finish first
> Finished
> GET / 304 102.987 ms - -

## 6.13 Async Await

1. callback 함수
   1. nodeJS가 비동기적으로 작동되기때문에, 동기함수와 함께 비동기함수가 실행되면 결과 값을 받아오는 것이 순서가 뒤바뀌게 된다
   2. 함수안의 함수이기때문에 콜백지옥이 나올 염려가 있음
   ```js
   console.log("start");
   Video.find({}, (error, videos) => {
     return res.render("home", { pageTitle: "Home", videos });
   });
   console.log("finished");
   ```
2. async await
   1. aysnc 상태(비동기)일때만 await 함수를 안에서 사용가능 함
   2. 직관적이라는 장점. 어떤 부분이 진행되는지 에러가 났는지 확인하기 쉬움
   3. await 함수가 완료될때까지 기다림(database에서 결과를 받을 때 까지 다른작업을 시행하지 않게함. 순서대로 실행 가능)
   4. try catch 구문을 사용하여, try 구문안에서 실행하는 것들중 에러가 나면 cath(error)로 보내져 에러 처리가 됨
   ```js
   export const home = async (req, res) => {
     const videos = await Video.find({});
     return res.render("home", { pageTitle: "Home", videos });
   };
   ```

## 6.14 Returns and Renders

1. return 역할
   - 본질적인 return 의 역할(값을 반환)보다 함수를 마무리 짓는 역할로 사용됨
   - res.redner() 이후 함수를 실행시키지 한게 하기위해. 만약 이후에도 response객체에 대한 함수를 실행시키면 에러가남
2. render한 것은 다시 render할 수 없음
   - res.render()/.redirect()/.sendState()/.end()등

```js
export const home = (req, res) => {
  Video.find({}, (error, videos) => {
    return res.render("home", { pageTitle: "Home", videos });
  });
};
```

## 6.15 Creating a Video part One

input element에서 name을 추가해야지만, req.body에서 값이들어옴

```pug
//uplaod.pug
block content
  form(method="POST")
    input(name="title", type="text", required, placeholder="Title")
    input(name="description", type="text", required, placeholder="description")
    input(name="createdAt", type="text", required, placeholder="createdAt")
    input(name="hashtags", type="text", required, placeholder="hashtags")
    input(type="submit", value="Upload Video")
```

**`String.prototype.trim()`** :

- 문자열 양 끝의 공백을 제거하고 원본 문자열을 수정하지않고 새로운 문자열을 반환함
- 공백 : space,tab, NBSP etc. / 개행문자 : LF, CR etc.

```js
///videoController.js
export const postUpload = (req, res) => {
  const { title, description, createdAt, hashtags } = req.body;
  const video = new Video({
    title,
    description,
    createdAt: Date.now(),
    hashtags: hashtags
      .split(",")
      .map(word => (word.startsWith("#") ? word.trim() : `#${word.trim()}`)),
  });
  console.log(video);
  return res.redirect("/");
```

## 6.16 Creating a Video part Two

**MongoDB의 collection이름이 Video가 아닌 videos인 이유**

Mongoose는 자동으로 모델을 찾고, 해당 모델의 이름을 따서 소문자+뒤에 s(복수형)을 붙여 컬렉션을 생성함
Tank 모델은 -> 컬렉션에 저장될 때, tanks로 저장됨

데이터베이스에 저장하고 나서 redirect 또한 render해야하기 때문에 `async await`을 사용해 데이터베이스 작업이 끝나기를 기다리게함

1. `Document.prototype.save()`
2. `Model.create()`

#### Document.prototype.save()

[`Document.prototype.save()`](https://mongoosejs.com/docs/api.html#document_Document-save)

```js
export const postUpload = async (req, res) => {
  const { title, description, createdAt, hashtags } = req.body;
  const video = new Video({
    title,
    description,
    createdAt: Date.now(),
    hashtags: hashtags
      .split(",")
      .map(word => (word.startsWith("#") ? word.trim() : `#${word.trim()}`)),
  });
  await video.save();
  return res.redirect("/");
};
```

#### Model.create()

[`Model.create()`](https://mongoosejs.com/docs/api.html#model_Model.create)
하나 이상의 문서를 데이터베이스에 저장하기 위한 손쉬운 방법
`MyModel.create(docs)`는 문서의 모든 문서에 대해 새로운 `MyModel(doc).save()`를 수행함
`create()`을 하게 되면 `save()`를 생략 가능
`create()`이 다음 미들웨어인 `save()`를 트리거하기 때문

```js
export const postUpload = async (req, res) => {
  const { title, description, createdAt, hashtags } = req.body;
  await Video.create({
    title,
    description,
    createdAt: Date.now(),
    hashtags: hashtags
      .split(",")
      .map(word => (word.startsWith("#") ? word.trim() : `#${word.trim()}`)),
  });
  return res.redirect("/");
};
```

Collection: Document들을 담고 있는 묶음

## 6.17 Exceptions and Validation

스키마는 자세하고 구체적일 수록 validation에 좋음

- Schema에 선언된 타입과 다른 타입을 입력해서 mongoDB에 저장하려고하면, 저장되지 않고 validation 에러가 발생함
- `required : true`인 경우에, 누락되면 validation 에러 발생
- `await`에서 에러가 생기면, 아무것도 실행되지않고 날아감(다음 코드고 실행되지않음)
  - 이것을 보완하기위해 `try catch`작성

#### try catch

```js
// videoController.js
export const postUpload = async (req, res) => {
  const { title, description, createdAt, hashtags } = req.body;
  try {
    await Video.create({
      title,
      description,
      hashtags: hashtags
        .split(",")
        .map(word => (word.startsWith("#") ? word.trim() : `#${word.trim()}`)),
    });
    return res.redirect("/");
  } catch (error) {
    return res.render("upload", {
      pageTitle: "Upload Video",
      errorMessage: error._message, // 데이터베이스에 저장하지 못할때 오는 에러메시지를 클라이언트로 전달함
    });
  }
};
```

#### default : () / requried : true

Schema 선언시, 기본 값을 설정할 수 있음

- `default:Date.now` 함수를 실행 하지않고 함수명만 쓴 이유 : 스키마를 기반으로 모델을 이용해서 데이터를 Create할때 해당 함수를 실행시킴
- `required : true`: 필수로 입력해줘야하는 값

```js
import mongoose from "mongoose";

//model의 data 생김새를 알려주는 작업
const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  createdAt: {
    type: Date,
    default: Date.now,
    /* video를 만들었을대 해당 Date.now() 함수 실행*/ required: true,
  },
  hashtags: [{ type: String }],
  meta: {
    views: { type: Number, default: 0, required: true },
    rating: { type: Number, default: 0, required: true },
  },
});

const Video = mongoose.model("Video", videoSchema);
export default Video;
```

`Model.create()` 도중, 에러가 발생하면 `errorMessage` 출력

```pug
block content
  if (errorMessage)
    span= errorMessage
  form(method="POST")
```

## 6.18 More Schema

[몽구스 스키마 타입 확인](https://mongoosejs.com/docs/schematypes.html)
Mongoose 스키마는 Mongoose 모델을 구성하기 위한 객체로 생각할 수 있음

타입이 구체적이고 정확할 수록, 프로젝트구현을 mongoose 와 mongoDB가 더욱 편하게 만들어줌

> **required**: boolean or function, if true adds a required validator for this property
> **default**: Any or function, sets a default value for the path. If the value is a function, the return value of the function is used as the default.
> **select**: boolean, specifies default projections for queries
> **validate**: function, adds a validator function for this property
> **get**: function, defines a custom getter for this property using Object.defineProperty().
> **set**: function, defines a custom setter for this property using Object.defineProperty().
> **alias**: string, mongoose >= 4.10.0 only. Defines a virtual with the given name that gets/sets this path.
> **immutable**: boolean, defines path as immutable. Mongoose prevents you from changing immutable paths unless the parent document has isNew: true.
> **transform**: function, Mongoose calls this function when you call Document#toJSON() function, including when you JSON.stringify() a document.

**String**

> **lowercase**: boolean, whether to always call .toLowerCase() on the value
> **uppercase**: boolean, whether to always call .toUpperCase() on the value
> **trim**: boolean, whether to always call .trim() on the value
> **match**: RegExp, creates a validator that checks if the value matches the given regular expression
> **enum**: Array, creates a validator that checks if the value is in the given array.
> **minLength**: Number, creates a validator that checks if the value length is not less than the given number
> **maxLength**: Number, creates a validator that checks if the value length is not greater than the given number
> **populate**: Object, sets default populate options

**Number**

> **min**: Number, creates a validator that checks if the value is greater than or equal to the given minimum.
> **max**: Number, creates a validator that checks if the value is less than or equal to the given maximum.
> **enum**: Array, creates a validator that checks if the value is strictly equal to one of the values in the given array.
> **populate**: Object, sets default populate options

**Date**

> **min**: Date, creates a validator that checks if the value is greater than or equal to the given minimum.
> **max**: Date, creates a validator that checks if the value is less than or equal to the given maximum.
> **expires**: Number or String, creates a TTL index with the value expressed in seconds.
> **ObjectId** > **populate**: Object, sets default populate options

[몽구스 스키마 타입 정의](https://mongoosejs.com/docs/guide.html)
몽구스의 모든 것은 스키마로 시작함.
각 스키마는 MongoDB 컬렉션에 매핑되고 해당 컬렉션 내 문서의 모양을 정의함

스키마의 타입정의와 input element에도 이중으로 하는 것이 좋음

- input element에만 적용시, 일부 사용자들이 직접 html을 수정하여 데이터를 입력할 수 있음
- Schema에만 적용시, validation에 대한 에러메시지를 추가해줘야함

```js
// models/Video.js
const videoSchema = new mongoose.Schema({
  title: { type: String, required: true, maxLength: 80 },
  description: { type: String, required: true, minLength: 10 },
  createdAt: { type: Date, default: Date.now, required: true },

// upload.pug
  form(method="POST")
    input(
      placeholder="Title",
      required,
      type="text",
      name="title",
      maxLength=80)
    input(
      placeholder="Description",
      required,
      type="text",
      name="description",
      minLength=20)
```

## 6.19 Video Detail

**[정규표현식](http://regexpal.com)**

- [mdn 정규표현식](https://developer.mozilla.org/ko/docs/Web/JavaScript/Guide/Regular_Expressions)

#### 몽고DB Document [링크1](https://mongodb.github.io/node-mongodb-native/api-bson-generated/objectid.html) [링크2](https://docs.mongodb.com/manual/reference/method/ObjectId/)

> class ObjectID()
> Arguments:
> id (string) – Can be a 24 byte hex string, 12 byte binary string or a Number.
> 몽고DB는 ObjectID를 24바이트 16진 문자열 표현으로 반환한다.
> === 정규표현식 :`([0-9a-f]{24})`

##### 십육진법 (Hexadecimal)

십육진법은 십육을 밑으로 하는 기수법이다. 보통 0부터 9까지의 수와 A에서 F까지의 로마 문자를 사용하고, 이때 대소문자는 구별하지 않음
**Hexadecimal**: 0~9까지의 숫자와 A-F까지의 알파벳이 조합된 string

#### [findOne()](https://mongoosejs.com/docs/api.html#model_Model.findOne)

해당 조건과 일치하는 document를 찾음
\_id로 찾는 경우에는 `findById()`를 사용할 것을 권장
`findById(id)`는 거의 `findOne({ \_id: id })`과 동일합니다.

#### [findById](https://mongoosejs.com/docs/api.html#model_Model.findById)

`async await` 잊지말기 ㅠㅠ

```js
export const watch = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  return res.render("watch", { pageTitle: video.title, video });
};
```

#### [`option:id`](https://mongoosejs.com/docs/guide.html#id)

mongoose 에서 \_id 값을 id로 받게해줌

```pug
extends base.pug
block content
  div
    p= video.title
    small= video.createdAt
  a(href=`${video.id}/edit`) Edit Video &rarr;
```

정규표현식으로 id값을 매칭시킴
`([0-9a-f]{24})` : 0~9, a~z로 이루어진 24자 문자

```js
videoRouter.get("/:id([0-9a-z]{24})", watch);
```

## 6.20 Edit Video part One

에러처리를 먼저함

- `Video.findById(id)` 의 값이 없는경우 = 사용자가 존재하지않는 id 값에 접근하는 경우
- 데이터가 없으면 `404` 페이지로 `rendering` 해줌

```js
// contoller/videoController.js
export const watch = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id); // 존재하지않는 id값에 접근 하는 경우
  if (!video) {
    return res.render("404", { pageTitle: "Video not found." });
  }
  return res.render("watch", { pageTitle: video.title, video });
};
export const getEdit = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.render("404", { pageTitle: "Video not found." });
  }
  return res.render("edit", { pageTitle: `Editing ${video.title}`, video });
};
```

데이터베이스에서 받아온 video 정보를 기본값으로 채워줌
해쉬태그의 경우에는 데이터베이스에서 배열로 저장하기 때문에 `.join()`메서드를 사용해 string 타입으로 변환함

```pug
//edit.pug
form(method="POST")
  input(name="title", placeholder="Video Title", value=video.title, required)
  input(
    placeholder="Description",
    required,
    type="text",
    name="description",
    minlength=20,
    value=video.description) 
  input(
    placeholder="Hashtags, separated by comma.",
    required,
    type="text",
    name="hashtags",
    value=video.hashtags.join())
  input(value="Save", type="submit")
```

#### [`exec()`](https://mongoosejs.com/docs/promises.html)

promise로 반환해주는 함수.
현재 `async await`함수를 사용하고 있기때문에 `exec()`을 사용하나 하지않나 기능 결과는 동일함

- find, findOne, findById, findOneAndUpdate 등의 메서드의 리턴값은 Query 임. Mongoose Query는 then을 사용할수있는 유사 promise
- 대신 `exec()`을 사용하면 온전한 promise 반환값을 얻을 수 있음.
- 에러가 났을때 stack trace 에 오류가 발새한 코드의 위치가 포함됨

## 6.21 Edit Video part Two

#### [`String.prototype.startsWith()`](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith)

startsWith() 메소드는 어떤 문자열이 특정 문자로 시작하는지 확인하여 결과를 true 혹은 false로 반환

#### [`String.prototype.endsWith()`](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith)

The endsWith() 메서드를 사용하여 어떤 문자열에서 특정 문자열로 끝나는지를 확인할 수 있으며, 그 결과를 true 혹은 false로 반환

```js
// controller/videoController.js
export const postEdit = async (req, res) => {
  const { id } = req.params;
  const { title, description, hashtags } = req.body;
  const video = await Video.findById(id).exec();
  video.title = title;
  video.description = description;
  video.hashtags = hashtags
    .split(",")
    .map(word => (word.startsWith("#") ? word : `#${word}`));
  video.save();
  return res.redirect(`/videos/${id}`);
};
```

## 6.22 Edit Video part Three

#### [`Model.exists()`](https://mongoosejs.com/docs/api/model.html#model_Model-exists)

- Returns a document with \_id only if at least one document exists in the database that matches the given filter, and null otherwise.
- return : Query | null

```js
await Character.deleteMany({});
await Character.create({ name: "Jean-Luc Picard" });

await Character.exists({ name: /picard/i }); // { _id: ... }
await Character.exists({ name: /riker/i }); // null
```

#### [`Model.findByIdAndUpdate()`](https://mongoosejs.com/docs/api/model.html#model_Model-findByIdAndUpdate)

- Finds a matching document, updates it according to the update arg, passing any options, and returns the found document (if any).

```js
A.findByIdAndUpdate(id, update, options); // returns Query
A.findByIdAndUpdate(id, update); // returns Query
A.findByIdAndUpdate(); // returns Query
```

```js
// controller/videoController.js
export const postEdit = async (req, res) => {
  const { id } = req.params;
  const { title, description, hashtags } = req.body;
  const video = await Video.exists({ _id: id }).exec();
  if (!video) {
    return res.render("404", { pageTitle: "Video not found" });
  }
  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: hashtags
      .split(",")
      .map(word => (word.startsWith("#") ? word : `#${word}`)),
  });
  return res.redirect(`/videos/${id}`);
};
```

## 6.23 Middlewares

### [Middleware](https://mongoosejs.com/docs/middleware.html#middleware)

미들웨어(pre또는 post훅이라고도 불림)는 비동기 함수를 실행하는 동안 제어가 전달되는 함수
몽구스는 `document middleware`, `model middleware`, `aggregate middleware`, `query middleware` 4가지 미들웨어 존재

[model middleware가 지원하는 기능](https://mongoosejs.com/docs/middleware.html#types-of-middleware)
document middleware함수에서 this는 현재 document를 참조함

데이터베이스에 전체 비디오 삭제
db.videos.remove({})가 deprecated됐다고 뜨시는 분들은
db.videos.deleteMany({})로 전체 비디오를 삭제하시면 됩니다.

[**Pre**](https://mongoosejs.com/docs/middleware.html#pre)
주의! pre안에 콜백함수로 화살표 함수 쓰게 되면 this의 대상이 달라지기 때문에 function(){}으로 써야함

```js
pre("save", async () => {});
X;
```

**`model` 이 만들어 지기 전에 미들웨어를 만들어야함**

- `this` : 저장하고자 하는 문서를 가리킴

```js
//models/Video.js
videoSchema.pre("save", async function () {
  this.hashtags = this.hashtags[0]
    .split(",")
    .map(word => (word.startsWith("#") ? word : `#${word}`));
});
```

### 데이터베이스에서 데이터 삭제하기

1. 몽고 사용하기
   $ mongosh
2. 내가 가진 db 보기
   $ show dbs
3. 현재 사용 중인 db 확인
   $ db
4. 사용할 db 선택하기
   $ use dbName
5. db 컬렉션 보기
   $ show collections
6. db 컬렉션 안에 documents 보기
   $ db.collectionName.find()
7. db 컬렉션 안에 documents 내용 모두 제거하기
   $ db.collectionName.remove({})

## 6.24 Statics

### [Statics](https://mongoosejs.com/docs/guide.html#statics)

모델에 static 함수를 추가 가능
스키마에서 컴파일된 모델에 정적 "class" 메서드를 추가함

**Static 사용하는 두 가지 방법**

```js
// Assign a function to the "statics" object of our animalSchema
animalSchema.statics.findByName = function (name) {
  return this.find({ name: new RegExp(name, "i") });
};
// Or, equivalently, you can call `animalSchema.static()`.
animalSchema.static("findByBreed", function (breed) {
  return this.find({ breed });
});
```

동일한 기능을 하는 `static 함수` (정적 메소드)

```js
// models/Video.js

//1
videoSchema.static("formatHashTags", function (hashtags) {
  return hashtags
    .split(",")
    .map(word => (word.startsWith("#") ? word : `#${word}`));
});

//2
videoSchema.statics.formatHashTags = function (hashtags) {
  return hashtags
    .split(",")
    .map(word => (word.startsWith("#") ? word : `#${word}`));
};
```

## 6.25 Delete Video

#### [findByIdAndDelete()](https://mongoosejs.com/docs/api.html#model_Model.findByIdAndDelete)

document의 \_id 필드로 MongoDB `findOneAndDelete()` 명령을 실행함
`findByIdAndDelete(id)`는 `findOneAndDelete({ \_id: id })`의 줄임말임

[Removed `remove()` , `deleteOne()`or `deleteMany()`를 쓸것](https://mongoosejs.com/docs/migrating_to_7.html#removed-remove)

### Delete 기능

```js
// controller/videoController.js
export const deleteVideo = async (req, res) => {
  const { id } = req.params;
  try {
    await Video.findByIdAndDelete(id);
    return res.redirect("/");
  } catch (erorr) {
    return res.render("404", { pageTitle: "Video not found" });
  }
};
//router/videoRouter.js
videoRouter.route("/:id([0-9a-f]{24})/delete").get(deleteVideo);
```

## 6.26 Search part One

#### [`Query.prototype.sort()`](https://mongoosejs.com/docs/api.html#query_Query-sort)

정렬 순서를 설정함.
개체가 전달되면 허용되는 값은 `asc, desc, 오름차순, 내림차순, 1 및 -1` 임.

`await Video.find({}).sort({ createdAt: "desc" })` : 작성 최근 시간순으로 정렬

```js
export const home = async (req, res) => {
  try {
    const videos = await Video.find({}).sort({ createdAt: "desc" });
    return res.render("home", { pageTitle: "Home", videos });
  } catch (error) {
    return res.render(error);
  }
};
```

## 6.27 Search part Two

#### [`req.query`](https://expressjs.com/ko/api.html#req.query)

라우트 안에 query string parameter를 포함하고 있는 객체로, URL에서 데이터를 가져올 때 주로 사용.
예) `?keyword="food" => {keyword: "food"}`
query parse가 비활성화로 설정되면 빈 객체 {}이고, 그렇지 않으면 구성된 query parse의 결과

`keyowrd` 가 포함된 `search` 값

```js
export const search = async (req, res) => {
  const { keyword } = req.query;
  let videos = [];
  if (keyword) {
    videos = await Video.find({
      title: {
        $regex: new RegExp(`${keyword}`, "i"),
      },
    });
  }
  return res.render("search", { pageTitle: "Search", videos });
};
```

#### [`Model.find()`](https://mongoosejs.com/docs/api.html#model_Model.find)

documents를 찾음(findOne과 다르게 전체 document를 찾습니다.)
Mongoose는 명령이 전송되기 전에 모델의 스키마와 일치하도록 필터를 캐스팅함

[정규표현식](https://www.regexpal.com)

#### [몽고DB regex (`$regex`)](https://docs.mongodb.com/manual/reference/operator/query/regex)

몽고DB에서 정규표현식을 사용하기 위해 사용하는 키워드
쿼리의 패턴 일치 문자열에 대한 정규식 기능을 제공함

```js
videos = await Video.find({
  title: {
    $regex: new RegExp(`${keyword}`, "i"),
  },
});
```

#### [RegExp mdn](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/RegExp)

RegExp 생성자는 패턴을 사용해 텍스트를 판별할 때 사용함

#### RegExp 사용 방법

RegExp 객체는 리터럴 표기법과 생성자로써 생성할 수 있음
리터럴 표기법의 매개변수는 두 빗금으로 감싸야 하며 따옴표를 사용하지 않음
생성자 함수의 매개변수는 빗금으로 감싸지 않으나 따옴표를 사용

```js
/ab+c/i 를 아래 RegExp 생성자를 이용해서 만들 수 있습니다.
new RegExp(/ab+c/, 'i') // 리터럴 표기법
new RegExp('ab+c', 'i') // 생성자 함수
```

## 6.28 Conclusions
