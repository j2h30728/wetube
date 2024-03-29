## 7 USER AUTHENTI

## 7.0 Create Account part One

#### [SchemaType.prototype.unique()](https://mongoosejs.com/docs/api.html#schematype_SchemaType-unique)

고유 인덱스를 선언함
제약 조건을 위반하면 Mongoose 유효성 검사 오류가 아니라 저장할 때 MongoDB에서 E11000 오류를 반환함.

`unique: true` :

- USER의 email 이나 username 은 딱 하나만 존재함
- 같은 email/usename을 가진 계정이 여러개면안됨

```js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  location: String,
});

const User = mongoose.model("User", userSchema);
export default User;
```

## 7.1 Create Account part Two

```js
// controller/userController
export const postJoin = async (req, res) => {
  const { username, email, password, name, location } = req.body;
  await User.create({
    username,
    email,
    password,
    name,
    location,
  });
  return res.redirect("/login");
};
```

postJoin 이후 terminal

```
$ monghsh
$ show dbs
$ use wetube
$ show collection
$ db.users.find()
```

## 7.2 Creating Account part Three

결정적 함수 (deterministic function)
같은 입력값에는 항상 같은 해시 결과값이 나옴

[비밀번호 털렸다고? 암호화. 해시함수. 5분 설명 영상](https://www.youtube.com/watch?v=67UwxR3ts2E)

`remove()` 명령어 실행이 안될 때
`db.users.remove()`는 deprecated되었기 때문에
`db.users.deleteMany({})`로 지우시면 됩니다.

[해시함수 테스트](https://emn178.github.io/online-tools/sha256.html)

#### bcrypt

- 암호를 해싱할 때 사용
- blowfish cipher 기반으로 만들어짐
- 여러 언어에서 사용가능

[bcrypt 설치](https://www.npmjs.com/package/bcrypt)
암호를 해시하는 데 도움이 되는 라이브러리입니다.
`npm i bcrypt`

```js
bcrypt.hash(유저 비밀번호 , db에 저장하기 전에 몇 번 해싱할건지, 해싱하고 나온 출력값: 콜백함수)
```

[`Schema.prototype.pre()`](https://mongoosejs.com/docs/api.html#schema_Schema-pre)

여기서의 this는 create 되는 user의 this를 가리킴
save 하기전에 입력한 비밀번호를 5번 해싱하고 저장

```js
userSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 5);
});
```

## 7.3 Form Validation

### [$or](https://docs.mongodb.com/manual/reference/operator/query/or/#mongodb-query-op.-or)

`$or 연산자`는 둘 이상의 조건에 대해 논리적 OR 연산을 수행하고
조건 중 하나 이상을 충족하는 문서를 선택함

```js
db.inventory.find({ $or: [{ quantity: { $lt: 20 } }, { price: 10 }] });
```

```js
export const postJoin = async (req, res) => {
  const pageTitle = "join";
  const { username, email, password, password2, name, location } = req.body;

  // 비밀번호와 비밀번호확인이 동일하지 않을때
  if (password !== password2) {
    return res.render("join", {
      pageTitle,
      errorMessage: "Password confirmation does not match.",
    });
  }

  // username과 email이 db에 이미 존재할때
  const exists = await User.exists({ $or: [{ username }, { email }] });
  if (exists) {
    return res.render("join", {
      pageTitle,
      errorMessage: "This username/email is already taken.",
    });
  }
  await User.create({
    username,
    email,
    password,
    name,
    location,
  });
  return res.redirect("/login");
};
```

## 7.4 Status Codes

### [상태코드](https://ko.wikipedia.org/wiki/HTTP_%EC%83%81%ED%83%9C_%EC%BD%94%EB%93%9C)

- **200(OK)**: 서버가 요청을 제대로 처리했다는 뜻이다. 이는 주로 서버가 요청한 페이지를 제공했다는 의미로 쓰임
- **400(Bad Request)**: 서버가 요청의 구문을 인식하지 못할 때 발생함. 클라이언트 측에서 문제가 있을 때 주로 발생
- **404(Not Found)**: 서버가 요청한 페이지를 찾을 수 없을 때 발생한다. 서버에 존재하지 않는 페이지에 대한 요청이 있을 경우 서버는 이 코드를 제공함

1. 구글 크롬에서 username과 pssword 정보를 가지고 요청을 보낸뒤
2. 응답 상태코드로 200을 받으면
3. 구글 크럼이 계정 새성이 성공적인 것으로 판단하고 pssword를 저장할 것이냐 묻는것
4. 에러를 보냈지만 상태코드는 200을 보내고 있기 때문에 이런 상황이 오는 것
5. 브라우저에게 render은 됐지만 에러가 있었음을 알려줘야 함.
6. clients errors 400 bad request: 클라이언트에서 발생한 에러때문에 요청을 처리하지 못할때 쓰는 것

브라우저에게 상황 알리기

- 상태코드 200 : 해당 URL을 브라우저 히스토리에 남김
- 상태코드 404 : 해당 URL을 브라우저 히스토리에 남기지 않음

#### [`res.status(code)`](https://expressjs.com/ko/api.html#res.status) [링크1](https://nodejs.org/api/http.html#http_response_statuscode)

response에 대한 HTTP 상태를 설정 (status를 설정)

## 7.5 Login part One

## 7.6 Login part Two

[bcrypt를 이용해서 비밀번호 비교](https://www.npmjs.com/package/bcrypt)

`password`: 유저가 입력한 비밀번호
`user.passwordHash`: DB에 해시화되서 저장된 비밀번호

```js
const match = await bcrypt.compare(password, user.passwordHash);
//return boolean
```

```js
import bcrypt from "bcrypt";

export const postLogin = async (req, res) => {
  const { username, password } = req.body;
  // 존재하지 않는 username 일 경우,
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).render("login", {
      pageTitle: "Login",
      errorMessage: "An account with this username does not exists.",
    });
  }

  // 입력한 비밀번호가 맞는지 확인
  const isOkay = await bcrypt.compare(password, user.password);
  if (!isOkay)
    return res.status(400).render("login", {
      pageTitle: "Login",
      errorMessage: "Wrong password.",
    });

  return res.redirect("/");
};
```

## 7.7 Sessions and Cookies part One

### 세션

백엔드와 브라우저 간에 어던 활동을 했는지 기억하는 것

- 로그인 되어있으면, 현재 사용하고 이쓴 브라우저와 백엔드사이에 세션존재
- 2주정도후에 세션이 사라짐. 없어져서 다시 로그인해야함
- 세션= 브라우저와 백엔드 사이의 memory, history같은 것
- 작동하려면 백엔드와 브라우저가 서로에 대한 정보를가지고 있어야함

1.  로그인 페이지에서 HTTP 요청을 하면
2.  요청이 처리되고 끝나게 될대, 그 이후로는 백엔드가 아무것도 할 수 없음

- 백엔드와 브라우저간에 할수 있는게 없다는것
- home 으로가 get요청을 해도 백엔드가 HTML을 render하고나면 연결이 끝남
- 계쏙 연결이 유지되는 wifi랑 다름

#### stateless(무상태)

HTTP는 상태 비저장(stateless) 프로토콜임.
한 번 연결 되었다가 끝나기 때문에 둘사이에 state가 없게됨.
인증된 사용자가 애플리케이션을 탐색할 때 후속 요청에서 기억해야하므로 로그인한 사용자가 있는 웹 어플리케이션에 문제가됨
이 문제를 해결하기위해 웹 응용 프로그램은 응용 프로그램 서버와 사용자 브라우저간에 상태를 유지할 수 있는 세션을 사용
세션은 브라우저에서 HTTP쿠키를 설정하며 설정되면 브라우저는 요청이 있을때마다 서버로 전송함


- 사용자가 백엔드에 뭔가 요청할때마다 누가 요청하는지 알 수있게 로그인시에 사용자에게 정보를 줘야함.


조그만한 텍스트를 줌
유저가 우리에게 요청을 보낼때마다 그 텍스트를 같이 보내달라고함 => 인식 구별가능
: 유저가 누구인지 알수 있게 해주는 것

### [express-session](https://www.npmjs.com/package/express-session)

Express용 세션 미들웨어
세션 데이터는 쿠키 자체에 저장되지 않고 세션 ID에만 저장됨.
세션 데이터는 서버 측에 저장됨
`npm i express-session`

#### [Session 사용 예시](https://github.com/expressjs/session#example)

`req.session.id` 또는 `req.sessionID`
브라우저가 request할 때 같이 보내는 `session id`

#### [secret](https://github.com/expressjs/session#secret)

세션 ID 쿠키에 서명하는데 사용
secret 값을 변경하면 기존에 존재하던 세션들이 모두 무효화됨

[**HTTP 쿠키**](https://developer.mozilla.org/ko/docs/Web/HTTP/Cookies)
웹쿠키, 브라우저쿠키
서버가 사용자의 웹 브라우저에 전송하는 작은 데이터 조각. 브라우저는 데이터 조각(쿠키에 세션id저장)을 저장해놓아다가, 동일한 서버에 재 요청시 저장된 데이터를 함께 전송함
쿠키는 두 요청이 동일한 브라우저에서 들어왔는지 아닌지 판단할 때 주로 사용
이를 이용해 사용자 로그인 상태 유지
상태가 없는 (stateless) HTTP 프로토콜에서 상태정보를 기억시켜줌

세 가지 목적으로 사용

1. 세션관리 : 서버에 저장해야할 로그인,장바구니, 게임스코어 등의 정보관리
2. 개인화 : 사용자 선호, 테마 등의 세팅
3. 트래킹 : 사용자 행동을 기록하고 분석하는 용도

현재는, modern storage APIs를 사용해 정보를 저장하는 것을 권장

- 정보를 클라이언트 측에 저장하려면 ModerAPIs(localStorage, sessionStorage)와 IndexDB사용
- 쿠키는 모든 요청마다 쿠키가 함께 전송되기때문에 성능이 떨어지는 원인 될수 있기 때문임(특히 mobile data connections)

#### [resave (변경 사항이 없어도 저장)](https://github.com/expressjs/session#resave)

request하는 동안 세션이 수정되지 않은 경우에도 세션이 세션 저장소에 다시 저장되도록 함

#### [saveUninitialized (세션 초기화 전에도 저장)](https://github.com/expressjs/session#saveuninitialized)

"초기화되지 않은" 세션을 저장소에 강제로 저장함

```js
import session from "express-session";

//session 모듈 사용
app.use(
  session({
    secret: "Hello!",
    resave: true,
    saveUninitialized: true,
  })
);

//세션스토어에 존재하는 모든 세션데이터 조회
app.use((req, res, next) => {
  req.sessionStore.all((error, sessions) => {
    console.log(sessions);
    next();
  });
});
```

## 7.8 Sessions and Cookies part Two

세션 : 서버측에서 제공해주는 데이터
쿠기 : 클라이언트측에서 저장하고 사용하는 데이터

`req.sessionStore()` :

1. 처음에는 undefine : 세션은 서버에서 만들어줘야함. 첫 요청에는 가지고 있지않음.
   - exprees-session에서 세션id 생성, 브라우저에게 전달
2. 첫 번째요청 이후 넘겨준 세션데이터(세션id)를 클라이언트가 쿠키에 세션ID를 저장함
   - 브라우저는 쿠키에 세션id저장
   - express(서버) 세션 db에 저장
3. 클라이언트가 매 요청마다 서버에게 세션ID를 전달해 보여줌
   - 쿠키에 저장한 세션id를 통해 다시 방문 할때마다 계속 로그인을 유지시킬 수 있음
   - 세션id를 req와 함께 보냄
4. 세션은 서버가 만들어서 제공해주기 때문에 서버가 재부팅되면 세션도 초기화됨
   - DB에 저장하여 관리
   - 실 운영에는 서버가 꺼지는 일이없기때문

## 7.9 Logged In User

- '/add-one' 방문할 때마다 서버에서 전달한 세션 id를 띄움
- `브라우저 - 개발자도구 - 검사 - 애플리케이션 - 쿠키` 에서 확인가능
  1. 처음에는 쿠키란은 비어있음

```js
app.get("/add-one", (req, res, next) => {
  req.session.potato += 1;
  return res.send(`${req.session.id} ${req.session.potato}`);
});
```

아래의 코드를 통해 세션 id와 쿠키의 관계를 확인

```js
app.use((req, res, next) => {
  req.sessionStore.all((error, sessions) => {
    console.log(sessions);
    next();
  });
});
app.get("/add-one", (req, res, next) => {
  req.session.potato += 1;
  console.log(req.session);
  return res.send(`${req.session.id} ${req.session.potato} `);
});
```

1. 처음 session을 부를때 : 사용자가 홈페이지를 처음 접속함

- 세션 id 없이 비워져있는것을 확인할 수 있음

```js
// console.log(sesstion)
[Object: null prototype] {}

// console.log(req.session)
Session {
  cookie: { path: '/', _expires: null, originalMaxAge: null, httpOnly: true },
  potato: NaN
}
```

2. 홈페이지에 한번 접근하여 세션 id를 전달받음

- session : cookie,potato를 담은 객체 확인가능
- req.session : potato가 1 증가한것을 확인할 수 있음

```js
// console.log(session)
[Object: null prototype] {
  nZlHw_5kTNgxroc4nI0v1UIXlraMDou2: {
    cookie: { originalMaxAge: null, expires: null, httpOnly: true, path: '/' },
    potato: null
  }
}

// console.log(req.session)
Session {
  cookie: { path: '/', _expires: null, originalMaxAge: null, httpOnly: true },
  potato: 1
}
```

## 7.10 Logged In User part Two

#### [res.locals](https://expressjs.com/ko/api.html#res.locals)

request 범위가 지정된 response 로컬 변수를 포함하는 객체이므로 request, response 주기동안 렌더링된 view에서만 사용할 수 있음
(Pug나 EJS같은 템플릿 엔진에서 사용 가능하다는 의미)
이 속성은 request path, 인증된 사용자, 사용자 설정 등과 같은 request level의 정보를 노출하는 데 유용함.

```js
// 사용 예시
app.use(function (req, res, next) {
  res.locals.user = req.user;
  res.locals.authenticated = !req.user.anonymous;
  next();
});
```

1. 원하는 값을 requst session 객체에 추가
   - view 단에서는 `req.session.loggedIn` 으로 불러올수 없음 => `res.locals`사용필요
   - `req.session.세션에넣고싶은속성이름 = 세션에넣고싶은 값`

```js
// controller/userController.js
export const postLogin = async (req, res) => {
  const { username, password } = req.body;
  /*.....중략 ...*/
  req.session.loggedIn = true; // 로그인 유무
  req.session.user = user; // 로그인한 유저 정보
  return res.redirect("/");
};
```

2. response 로컬변수를 포함하는 객체에 추가 : requset,response 주기동안 렌더링된 view에서 사용가능(템플릿엔진)
   - `res.locals.클라이언트에서 가져오고싶은 이름 = req.session.세션에서 넣고싶은 속성`

```js
// middlewares.js
export const localsMiddleware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn); // 로그인 유무
  res.locals.loggedInUser = req.session.user; //로그인한 유저 정보
  res.locals.siteName = "Wetube"; //문자열로 직접 값을 넣어 줄수도 있음
  next(); // 미들웨어필수구문
};
```

3. view단에서 `res.locals` 객체 변수 사용

- siteName : home 페이지에서 헤더이름 `Home | Wetube` 확인가능
- 로그인 했을경우, username'sprofile Logout 버튼 보임
- 로그인 하지않을 경우, Join, Login 버튼 보임

```pug
doctype html
html(lang="ko")
  head
    title #{ pageTitle } | #{ siteName }
    link(rel="stylesheet", href="https://unpkg.com/mvp.css")
  body
    header
      h1= pageTitle
      nav
        ul
          li
            a(href="/") Home
          if (loggedIn)
            li
              a(href="/profile") #{ loggedInUser.username }'s profile
            li
              a(href="/logout") Logout
          else
            li
              a(href="/join") Join
            li
              a(href="/login") Login
```

## 7.11 Recap

브라우저가 backend와 상호작용할 때마다 아래의 session이라는 middleware가 브라우저에게 cookie쿠키를 전송함

```js
app.use(
  session({
    secret: "Hello!",
    resave: true,
    saveUninitialized: true,
  })
);
```

- session ID
  - 쿠키와 백엔드에 저장됨.
  - 백엔드는 사용되고 있는 모든 sessionID하는데 몇가지 문제 존재
    (백엔드는 생성된 모든 sessionID를 관리하는 곳임)
- 쿠키
  - 백엔드가 브라우저에게 주는 정보.(단지 정보를 주고 받는 방법)
  - 정채진 규칙이 있음.
  - 매번 백엔드를 request할때마다 브라우저는 알아서 그 request에 쿠키를 덧붙이게됨
  - http표준을 따르기 때문에 별개의 코드를 작성할 필요없이 자동으로 동작함
  - sessionID를 전송하는데 사용됨

브라우저는 쿠키로 뭘할지, 어디에 넣을 지 모든것을 알고있음
브라우저는 백엔드 로컬호스에 있는 url로 request를 보낼때마다 쿠카가 requset 에 붙여지는 것을 암

쿠키에는 어떤것도 다 넣을수있는데 우리는 쿠키에 sessionID를 넣음

- 브라우저와 백엔드와의 연결이 평생 보장된 것이 아니기 때문
- stateless인 http사용하기 때문에 홈페이지를 접속할때 connection이 연결되고 render 및 응답이 끝나면 connection이 끊어짐. connection이 계속 유지되지않음.
- 이를 보완하기위해 사용자에게 sessionID를 주고, 쿠키에 sessionId를 넣음
- 쿠키의 두가지 역할
  1. 쿠키로 백엔드와 프론트엔드간의 정보교환
  2. sessionID 넣어서 사용

#### Session Store

session을 저장하는 곳
서버가 재시작될때 session sotre도 재시작 되어 이전에 저장된 값은 사라짐
다시 서버 재시작해서 접속하면 새로운 다른 쿠키를 받음 => 다른 cookie sotre이기 때문
추후에 cookie sotre을 mongoDB에 연결할 것

쿠키에 sessionId를 저장하고 새로고침을 진행해도 변경되지않음 : 백엔드가 session sotre안에 sessionID를 저장하고 있기 때문

쿠키완 세션은 다름. 쿠키를 사용해 어떤 브라우저를 위한 세션 id 인지 확인할 수 있음

`req.sessionID`은 브라우저마다 다르기 때문에 다르게 보일 것

# 7.12 MongoStore

session data가 쿠키안에 저장되지 않음. seesion id만 저장됨
session은 데이터 베이스에 저장함(데이터 자체는 데이터베이스)

### [Express Session](https://www.npmjs.com/package/express-session)

쿠키에는 세션 데이터가 아닌 세션 ID에만 저장됨
세션 데이터는 서버 측에 저장됨
하지만 기본 서버 측 세션 저장소인 MemoryStore는 production 환경용으로 설계되지 않았음

#### [Compatible Session Stores (호환가능한 세션 스토어)](https://www.npmjs.com/package/express-session#compatible-session-stores)

### [connect-mongo](https://www.npmjs.com/package/connect-mongo)

- 세션을 MongoDB에 저장할 것
- 서버를 재시작하더라도 세션은 데이터 베이스에 저장되어있어서 누군가 로그인되었있어도 잊어버리지 않음
- Typescript로 작성된 Connect 및 Express용 MongoDB 세션 저장소.
  `npm i connect-mongo`

```js
import MongoStore from "connect-mongo";

app.use(
  session({
    secret: "Hello!",
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: "mongodb://127.0.0.1:27017/wetube" }),
  })
);
```

`store: MongoStore.create({ mongoUrl: "mongodb://127.0.0.1:27017/wetube" }),` : 데이터 베이스에 session이름의 collection을 추가하여 session 정보를 저장함
(로그인 할경우, 지정해놓은 로그인정보가 들어감)

로그인 전

```js
//cli 에서 mongosh -> use wetube

wetube >
  db.sessions.find({})[
    {
      _id: "IQmy5qPwOpVwKS29zGkpsc2iYQlRm9Xm",
      expires: ISODate("2023-03-22T15:39:41.062Z"),
      session:
        '{"cookie":{"originalMaxAge":null,"expires":null,"httpOnly":true,"path":"/"}}',
    }
  ];
```

로그인후, mongo-Store를 통해 데이터베이스에 session 컬렉션이 추가되고 session정보가 저장된곳에 로그인 정보가 업데이트됨

```js
//cli 에서 mongosh -> use wetube
wetube >
  db.sessions.find({})[
    {
      _id: "IQmy5qPwOpVwKS29zGkpsc2iYQlRm9Xm",
      expires: ISODate("2023-03-22T15:40:48.612Z"),
      session:
        '{"cookie":{"originalMaxAge":null,"expires":null,"httpOnly":true,"path":"/"},"loggedIn":true,"user":{"_id":"64018fda246b074dc0c13782","username":"test","name":"test","password":"$2b$05$cgy8wZAT0c0T7SEWzD/Xbusz5T3Nf08qRS.BTkPUcoK1BPzGv937q","__v":0}}',
    }
  ];
```

# 7.13 Uninitialized Sessions

session authentication(인증)을 사용하면서 생길수 있는 문제
쿠키가 받고 저장하는것은 자동으로 되고있음(사용자에게 쿠키를 서버(+데이터베이스)에서는 세션을 만들고 저장)
방문하는 모든 사용자에 대해 쿠티를 만들어주고 세션을 만듬

만약, 사람이 아닌 봇이 웹사이트를 방문 하거나 로그인을 하지않고 구경만하는 사람이 방문한다면?
=> 상당한 크기의 데이터베이스가 필요함

로그인한 유저만 쿠키를 주는 것은 어떠할까?(= 내가 기억하고 싶은 유저)

```js
app.use(
  session({
    secret: "Hello!",
    resave: false,
    //true -> false 로 변경
    // 세션이 수정되면 데이터베이스에 업데이트함

    saveUninitialized: false,
    //true -> false 로 변경
    // 세션이 초기화되면 데이터베이스에 저장함

    store: MongoStore.create({ mongoUrl: "mongodb://127.0.0.1:27017/wetube" }),
  })
);
```

이제 웹사이트를 방문 한다고 쿠키를 다 주는 것이 아님
`saveUninitialized: false` :

- 세션을 수정할 때만 세션을 DB에 저장하고 쿠키를 넘겨줌
- 즉, backend가 로그인한 사용자에게만 쿠키를 주도록 설정
- iOS, 안드로이드와 달리 브라우저에서는 인증을 하기때문에 쿠키를 이용해 세션인증을 할 수 있음
  - token authentication
    - iOS나 안드로이드 앱들은 쿠키를 갖지 않기 때문에 token을 사용함
- 세션이 새로만들어지고 수정된적이 없을때 === `uninitialized`
- 세션 수정? => 현재 우리는 userController에서 초기화하고있음
  ```js
  req.session.loggedIn = ture;
  req.session.user = user;
  ```

`secret: "Hello!",` : secret과 mongoUrl은 코드에 보여지면 안되기 때문에 숨겨야함

- 웹사이트를 서버에 배포 할 때, DBURL을 코드상에 두면안됨
- db에는 username과 password가 있기 때문

---

**`resave`** : 모든 request마다 세션의 변경사항이 있든 없든 세션을 다시 저장

- `true`: 스토어에서 세션 만료일자를 업데이트 해주는 기능이 따로 없으면 true로 설정하여 매 request마다 세션을 업데이트 해주게 함

- `false`:
  - 변경사항이 없음에도 세션을 저장하면 비효율적이므로 동작 효율을 높이기 위해 사용
  - 각각 다른 변경사항을 요구하는 두 가지 request를 동시에 처리할때 세션을 저장하는 과정에서 충돌이 발생할 수 있는데 이를 방지하기위해 사용

#### [saveUninitialized](https://github.com/expressjs/session#saveuninitialized)

uninitialized("초기화되지 않은") 상태인 세션을 저장함
여기서 uninitialized 상태인 세션이란 request 때 생성된 이후로 아무런 작업이 가해지지않는 초기상태의 세션을 말함

- `true`:

  - 세션 초기화 전에도 저장
  - 클라이언트들이 서버에 방문한 총 횟수를 알고자 할때 사용

- `false`:
  - uninitialized 상태인 세션을 강제로 저장하면 내용도 없는 빈 세션이 스토리지에 계속 쌓일수 있음
  - 이를 방지, 저장공간을 아끼기 위해 사용함

# 7.14 Expiration and Secrets

cookie property

1. secret
   1. 우리가 쿠키에 sign 할 때 사용하는 string : 길게 작성, 강력하게, 무작위한 문자
   2. 쿠키에 sign? => backend가 쿠키를 줬다는 것을 보여주기 위함
   3. session hijack(납치)라는 공격유형이 존재하기 때문에 보호필요 : 쿠키를 훔쳐서 마치 해당 사용자인척 할 수 있음
   4. screte : string을 가지고 쿠키를 sign, 우리가 만든 것을 증명 할 수 잇음
2. domain
   1. 쿠키를 만든 backend가 누구인지, 어디로 가야하는 지 알려줌
      1. ex. 인스타그램, 페이스북, 구글...등등
      2. 브라우저는 도메인별로 쿠키를 저장하도록 되어있으며, 그 쿠키는 domain에 있는 backend로만 전송됨
         (ex. youtube 쿠키는 youtube.com으로만)
3. expire
   1. 만료날짜
   2. 만료날짜를 지정하지지 않으면 session cookie로 설정됨.
      1. 사용자가 닫으면 session cookie는 만료됨
      2. ex. 몇몇 브라우저에서 프로그램을 닫으면 쿠키가 사라지거나, 컴퓨터를 재시작할때 세션이 사라짐
4. Max-Age

   1. 언제 세션이 만료되는지. 쿠키를 얼마동안 만큼 유지 할 수있는지 ms로 지정함 == 지정한 시간 뒤에는 자동으로 쿠키가 사라짐(자동로그아웃됨)
   2. 브라우저가 평생 켜져있거나 사용자가 브라우저를 계속 켜놔도 세션에서 지정한 말료날짜에 맞춰서 만료됨(만료되는 날짜는 원하면 수정할 수 있음)
      1. 단위는 ms
      ```js
      app.use(
        session({
          secret: "Hello!",
          resave: false, // 세션이 수정되면 데이터베이스에 업데이트함
          saveUninitialized: false, // 세션이 초기화되면 데이터베이스에 저장함
          cookie: {
            maxAge: 20000, //20초 뒤에 쿠키가 만료됨 === 자동 로그아웃
          },
          store: MongoStore.create({
            mongoUrl: "mongodb://127.0.0.1:27017/wetube",
          }),
        })
      );
      ```

#### env

관습적으로 env 파일에 추가하는 모든 것은 대문자로 적어야함

1. root 장소에 `.env`파일 생성
2. env파일을 `.gitignore`에 추가
3. 비밀로 해야하는 string을 대문자로 환경변수로 만들고 문자할당
   1. ex) `DB_URL=mongodb://127.0.0.1:27017/wetube`
4. JS코드에서 비밀로 해야하는 string을 `process.env.[환경변수 이름]`로 바꾸기
   1. 현재 파일에서는 mongodbUrl과 session의 secretkey

#### [Set-Cookie](https://developer.mozilla.org/ko/docs/Web/HTTP/Headers/Set-Cookie)

Set-Cookie HTTP 응답 헤더는 서버에서 사용자 브라우저에 쿠키를 전송하기 위해 사용됩니다.

##### 쿠키에 설정가능한 옵션

**Domain**
쿠키가 적용되어야 하는 호스트를 지정.

**Expires**
HTTP 타임스템프로 기록된 쿠키의 최대 생존 시간(수명).

**Max-Age**
쿠키가 만료될 때 까지의 시간 (밀리세컨드)

[**secret**](https://www.npmjs.com/package/express-session)
이것은 세션 ID 쿠키에 서명하는 데 사용되는 비밀키

[COOKIE_SECRET에 넣을 랜덤 문자열 생성 사이트](https://randomkeygen.com/)

# 7.15 Environment Variables

### [dotenv](https://www.npmjs.com/package/dotenv)

`env` 파일내의 환경변수(`process.env`) 읽어오기

1. `npm install dotenv --save`
2. 처음 시작되는 파일에 `import 'dotevt/config';` 추가
   1. 또는
   ```js
   import dotenv from "dotenv";
   dotenv.config();
   ```

# 7.16 Github Login part One

### [1. Authorizing OAuth Apps](https://docs.github.com/en/developers/apps/building-oauth-apps/authorizing-oauth-apps)

다른 사용자가 OAuth 앱을 승인하도록 할 수 있음
GitHub의 OAuth 구현은 웹 브라우저에 대한 액세스 권한이 없는 앱에 대한 표준 인증 코드 부여 유형 및 OAuth 2.0 장치 인증 부여를 지원함

#### Web application flow

웹 애플리케이션 흐름: 브라우저에서 실행되는 표준 OAuth 앱에 대해 사용자에게 권한을 부여하는 데 사용됨
앱 사용자에게 권한을 부여하는 웹 애플리케이션 흐름은 다음과 같음

1. 로그인하려는 사이트에서 유저의 GitHub identity를 request하기 위해 유저를 GitHub 페이지로 리다이렉트시킵니다.
2. 유저는 리다이렉트된 GitHub에서 승인을 하고, GitHub에 의해 다시 로그인하려는 사이트로 리다이렉트됩니다.
3. 로그인 하려는 사이트는 유저의 액세스 토큰을 통해 API에 접근합니다.

```pug
// /views/login.pug
a(
  href="https://github.com/login/oauth/authorize?client_id=4c3405ef73df967b3238&allow_signup=false") Continue with Github &rarr;
```

> GET `https://github.com/login/oauth/authorize` > **`client_id`**:string 필수 : 내 깃허브 페이지가면됨
> **`allow_signup=false`**: 만약 깃허브 계정이 없다면, 회원가입을 권유하겠냐는 것. 현재 false이므로 회원가입을 권유하지 않음.

---

#### [깃허브 OAuth Apps Setting](https://github.com/settings/developers)

GitHub API를 사용하기 위해 등록한 애플리케이션임

[Scopes for OAuth Apps (OAuth 앱의 범위)](https://docs.github.com/en/developers/apps/building-oauth-apps/scopes-for-oauth-apps)

[Creating an OAuth App (OAuth앱 만들기)](https://docs.github.com/en/developers/apps/building-oauth-apps/creating-an-oauth-app)

# 7.17 Github Login part Two

> **`scope`** : 유저에게서 얼마나 많이 정보를 읽어내고 어떤 정보를 가져올 것에 대한 것 (필요한 정보많을 요청하도록 함)

- 카카오톡은 scope 가 permission 임

- scope parameter에 따라 정보를 요구하는게 달라짐
- 나 : 이러한 이러한 정보를 원함(어떤 정보를 요청하느냐에 따라 user는 승인 받게됨)
  => 깃허브 : 정보에 접근할수 있도록 토큰을 줌-
- 요구할 항목들을 공백을 두고 추가하면됨

##### 상식적으로 너무 긴 url, 수정될수있는 client_id, scope 들. 어떻게 따로 관리할까?

`https://github.com/login/oauth/authorize?client_id=...&scope=user%20repo_deployment`

```js
// userController.js
export const startGithubLogin = (req, res) => {
  const baseUrl = "https://github.com/login/oauth/authorize";
  const config = {
    client_id: "4c3405ef73df967b3238",
    allow_signup: false,
    scope: "read:user user:email", //여러개의 sope를 받을때는 공백을 넣어줌
  };
  const params = new URLSearchParams(config).toString();
  //'client_id=4c3405ef73df967b3238&allow_signup=false&scope=read%3Auser+user%3Aemail'
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
};
export const finishGithubLogin = (req, res) => res.redirect("/");
// 깃헙 로그인요청이 수락되었을 경우 실행되는 컨트롤러

///userRouter.js
userRouter.get("/github/start", startGithubLogin);
userRouter.get("/github/finish", finishGithubLogin);
```

```pug
// /views/login.pug
a(href="/users/github/start") Continue with Github &rarr;
```

github 페이지의 > Settings > Developer settings > Wetube 의 **Authorization callback URL** 에서 `http://localhost:4000/users/github/finish` 로 변경

- 사용자가, 요구하는 정보를 수락하여 깃헙 로그인인이 수락되었을 경우 해당 경로로 이동시켜줌

[URLSearchParams](https://developer.mozilla.org/ko/docs/Web/API/URLSearchParams) : URL의 쿼리문자열을 대상으로 작업할 수 있는 유틸리티 메서드를 정의함

[URLSearchParams.toString()](https://developer.mozilla.org/ko/docs/Web/API/URLSearchParams/toString) : URL에 쓰기 적합한 형태의 쿼리 문자열을 반환함

#### [Scopes for OAuth Apps](https://docs.github.com/en/developers/apps/building-oauth-apps/scopes-for-oauth-apps)

OAuth 앱은 초기 리디렉션에서 범위를 요청할 수 있음.
%20을 사용하여 공백으로 구분하여 여러 범위를 지정할 수 있습니다.

예시)
`https://github.com/login/oauth/authorize?client_id=...&scope=user%20repo_deployment`

#### [URLSearchParams](https://developer.mozilla.org/ko/docs/Web/API/URLSearchParams)

URLSearchParams 인터페이스는 URL의 쿼리 문자열에 대해 작업할 수 있는 유틸리티 메서드를 정의함.

#### [`URLSearchParams.toString()`](https://developer.mozilla.org/ko/docs/Web/API/URLSearchParams/toString)

`toString()` 은 URLSearchParams 인터페이스의 메소드로서, URL에서 사용할 수 있는 쿼리 문자열을 리턴함.

# 7.18 Github Login part Three

github client_id를 환경변수에 넣는 이유는 숨기기 위해서는 아님
어짜피 요청 URL에 client_id가 보여질 것
환경변수에 저장하여 언제 어디서든지 값을 가져와 사용하기 위함임

환경변수
`GH_CLIENT=4c3405ef73df967b3238`

client_secret - 오직 백엔드에만 존재해야되는 secret임
코드 어느곳에서든 보여지면 안되는 것임. 아무도 보면안됨!!

# 7.19 Github Login part Four

### [2. Users are redirected back to your site by GitHub](https://docs.github.com/en/developers/apps/building-oauth-apps/authorizing-oauth-apps#2-users-are-redirected-back-to-your-site-by-github)

사용자가 요청을 수락하면 GitHub는 코드 매개변수의 임시 code와 상태 매개변수의 이전 단계에서 제공한 state를 사용하여 사이트로 다시 리디렉션함

`POST Request`를 할 때, 반드시 필요한 파라미터들
`client_id`, `client_secret`, `code`

> POST `https://github.com/login/oauth/access_token`

```js
export const finishGithubLogin = async (req, res) => {
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SECRET,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  const data = await fetch(finalUrl, {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
  });
  const json = data.json();
};
```

`fetch`는 브라우저에 존재, 서버(node.js)에서는 존재하지않음
사용 불가능.

### [node-fetch](https://www.npmjs.com/package/node-fetch)

`npm install node-fetch@2.6.1`
(`npm i node-fetch`는 ESM-only Modlue)

```js
import fetch from "node-fetch";

export const finishGithubLogin = async (req, res) => {
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SECRET,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  const data = await fetch(finalUrl, {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
  });
  const json = await data.json();
  return res.send(json);
};
```

> {
> "access_token": "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",
> "token_type": "bearer",
> "scope": "read:user,user:email"
> }

### [3.Use the access token to access the API](https://docs.github.com/en/developers/apps/building-oauth-apps/authorizing-oauth-apps#3-use-the-access-token-to-access-the-api)

액세스 토큰을 사용하면 유저를 대신해 API에 요청할 수 있음

> Authorization: token OAUTH-TOKEN
> GET `https://api.github.com/user`

```js
export const finishGithubLogin = async (req, res) => {
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SECRET,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  const tokenData = await fetch(finalUrl, {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
  });

  const tokenRequest = await tokenData.json(); // 정상적인 응답일 경우, access_token, token_type, scope이 옴
  if ("access_token" in tokenRequest) {
    const { access_token } = tokenRequest;
    const userInfoData = await fetch("https://api.github.com/user", {
      method: "GET", // get 요청일 경우, 이 문구는 생략가능함
      headers: {
        Authorization: `Bearer ${access_token}`, //Authorization: Bearer OAUTH-TOKEN
      },
    });
    const userRequest = await userInfoData.json();
    console.log(userRequest);
  } else {
    return res.redirect("/login");
  }
};
```

> console에서 다양한 userinfo를 확인할 수 있음
> 다만, `email: null,`이 존재하는데 이것은 private이거나 존재하지않을 경우임

# 7.20 Github Login part Five

### [Github REST API (User)](https://docs.github.com/en/rest/reference/users)

사용자 API를 사용하면 인증된 사용자에 대한 공개 및 비공개 정보를 얻을 수 있습니다.

Get the authenticated user
인증된 사용자가 기본 인증 또는 사용자 범위의 OAuth를 통해 인증되면 응답에 공개 및 비공개 프로필 정보가 나열됩니다. 인증된 사용자가 사용자 범위 없이 OAuth를 통해 인증된 경우 응답에는 공개 프로필 정보만 나열됩니다.

[Add an email address for the authenticated user](https://docs.github.com/en/rest/users/emails?apiVersion=2022-11-28#list-email-addresses-for-the-authenticated-user--code-samples)

> GET `/user/emails`
> Authorization: token OAUTH-TOKEN

```js
if ("access_token" in tokenRequest) {
  const { access_token } = tokenRequest;
  const apiUrl = "https://api.github.com";

  //userdata 를 받아옴
  const userData = await (
    await fetch(`${apiUrl}/user`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })
  ).json();

  //private로 설정되어 userdata에서 받아오지못한 email을 해당 코드를 통해, email list를 불러옴
  const emailData = await (
    await fetch(`${apiUrl}/user/emails`, {
      headers: {
        Authorization: `token ${access_token}`,
      },
    })
  ).json();
  //이메일 리스트 배열을 순회해서 primary와 verified값이 true 인 email 검색
  const email = emailData.find(
    email => email.primary === true && email.verified === true
  );

  //유효한 이메일이 없다면 로그인창에 에러메시지와 함게 리다이렉트
  if (!email) {
    return res.redirect("/login");
  }
}
```

[List public email addresses for the authenticated user](https://docs.github.com/en/rest/reference/users#list-public-email-addresses-for-the-authenticated-user)
인증된 사용자의 공개 이메일 주소 나열

> GET `/user/public_emails`
> Authorization: token OAUTH-TOKEN

결과

```json
[
  {
    "email": "rachel2148072@gmail.com",
    "primary": true,
    "verified": true,
    "visibility": "private"
  },
  {
    "email": "60846068+j2h30728@users.noreply.github.com",
    "primary": false,
    "verified": true,
    "visibility": null
  }
]
```

# 7.21 Github Login part Six

1. 깃헙로그인 하기 클릭
2. 유저에게 정보 요청 (req.query로 code 값 받음)
3. 수락시 toeken발급 (POST 요청 : code + client_id + client_secret)
4. access_token이 발급되어 존재하면 api링크로 userdata 받아옴 (GET 요청 : 헤더에 포함 "Authorization: `Bearer ${access_token}`" )
   1. access_token : GithunAPI와 상호작용할 때 쓰임
5. userdata에서 email이 private하게 지정되어있으면 따로 api링크로 email list를 요청함 (GET 요청 : 헤더에 포함 "Authorization: `token ${access_token}`")
   1. 받은 이메일리스트를 .find() 메서드로 primary하고 verified한 email값을 받아옴
6. 유효한 이메일을 가지고 데이터베이스에 존재하는지 체크
   1. 존재한다면 로그인진행 (세션에 로그인정보 추가)
   2. 존재하지 않다면 회원가입 -> 로그인 (세션에 로그인정보 추가)

```js
//userController.js

    const existingUser = await User.findOne({ email: emailObj.email });
    if (existingUser) {
      req.session.loggedIn = true;
      req.session.user = existingUser;
      return res.redirect("/");
    } else {
      // 데이터베이스에 동일한 이메일을 가진 유저가 없을 경우(실제 회원가입/소셜로그인까지 합한것)
      const newUser = await User.create({
        name: userData.name ? userData.name : userData.login, // github에서 나같이 name이 없는경우에는 username과 동일하게 적용함
        username: userData.login,
        email: emailObj.email,
        password: "", // 소셜로그인시에는 비밀번호를 사용하지않음
        socialOnly: true, // 소셜로그인시에만 true, 아닌경우에는 입력하지않고 default값(false)유지시킬것
        location: userData.location,
      });
      req.session.loggedIn = true;
      req.session.user = newUser;
      return res.redirect("/");
    }
  } else {
    //엑세스 토큰을 받지못할 경우,
    return res.redirect("/login");
  }
```

```js
// model/User.js
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  socailOnly: { type: Boolean, default: false }, // 소셜로그인인지 구분
  password: { type: String }, // 소셜 로그인시에는 추가되지않음
  name: { type: String, required: true },
  location: String,
});
```

# 7.22 Log Out

```js
// userController.js
export const logout = (req, res) => {
  req.session.destroy();
  return res.redirect("/");
};
```

### [Session.destroy(callback)](https://www.npmjs.com/package/express-session)

세션을 파괴하고 req.session 속성을 설정 해제함.
완료되면 콜백이 호출됨

```js
req.session.destroy(function (err) {
  // cannot access session here
});
```

# 7.23 Recap

[카카오 로그인 구현하기 (REST API)](https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api)

카카오 로그인 구현하실 분들은 아래 링크들을 참조
구현 방식은 깃허브 로그인과 거의 동일

1. [애플리케이션 등록](https://developers.kakao.com/docs/latest/ko/getting-started/app)

2. [인가 코드 받기](https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api#request-code)

3. [토큰 받기](https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api#request-token)

4. [사용자 정보 가져오기](https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api#req-user-info)
