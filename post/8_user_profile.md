# 8 USER PROFILE

## 8.0 Edit Profile GET

## 8.1 Protector and Public Middlewares

### middlware 사용

로그인 유무에 따라서 페이지 경로 제한

```js
//middleware.js

//로그인 되어있을 경우 통과, 그렇지않을 경우 login 페이지로 리다이렉트
export const protectMiddleware = (req, res, next) => {
  if (req.session.loggedIn) {
    return next();
  } else {
    return res.redirect("/login");
  }
};

//로그인 되어있지 않을 경우 통과, 그렇지않을 경우 / 페이지로 리다이렉트
export const publickOnlyMiddleware = (req, res, next) => {
  if (!req.session.loggedIn) {
    return next();
  } else {
    return res.redirect("/");
  }
};
```

#### all

`.get().post()` 의 컨트롤러에 모두 미들웨어로 거침

```js
//rooteRouter.js
rootRouter
  .route("/join")
  .all(publickOnlyMiddleware)
  .get(getJoin)
  .post(postJoin);
rootRouter
  .route("/login")
  .all(publickOnlyMiddleware)
  .get(getLogin)
  .post(postLogin);

//userRouter.js
userRouter.route("/edit").all(protectMiddleware).get(getEdit).post(postEdit);
userRouter.get("/github/start", publickOnlyMiddleware, startGithubLogin);
userRouter.get("/github/finish", publickOnlyMiddleware, finishGithubLogin);
```

## 8.2 Edit Profile POST part One

[`Model.findByIdAndUpdate()`](https://mongoosejs.com/docs/api.html#model_Model.findByIdAndUpdate)

문서의 \_id 필드로 mongodb findAndModify 업데이트 명령을 실행함.
`findByIdAndUpdate(id, ...)`는 `findOneAndUpdate({ \_id: id }, ...)`와 동일

```js
// 사용 예시
Model.findByIdAndUpdate(id, { name: "jason bourne" }, options, callback);

// is sent as (+타입스크립트)
Model.findByIdAndUpdate(
  id,
  { $set: { name: "jason bourne" } },
  options,
  callback
);
```

## 8.3 Edit Profile POST part Two

#### option

`{new:true}` : 리턴값을 업데이트된 값을 넣어줌
기재하지 않는 디폴트 값은 업데이트 전의 오리지널 값을 리턴하마

```js
const updateUser = await User.findByIdAndUpdate(
  _id,
  {
    name,
    email,
    username,
    location,
  },
  { new: true } // 해당 옵션 값을 넣을경우, 리턴값이 업데이트된 값이 됨
);
req.session.user = updateUser;
```

## 8.4 Change Password part One

## 8.5 Change Password part Two

```js
export const getChangePassword = (req, res) => {
  if (req.session.socialOnly === true) {
    return res.redirect("/");
  }
  return res.render("users/change-password", { pageTitle: "Change Password" });
};
export const postChangePassword = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
    body: { oldPassword, newPassword, newPasswordConfirm },
  } = req;
  const user = await User.findById(_id);

  // await user.save()에서 데이터이스에서 데이터가 수정됨
  user.password = newPassword;
  user.location = "이거되나?";

  // 비밀번호를 다섯번 해싱하는 pre 함수 트리거시킴 userSchema.pre("save",..)
  // 해싱된 비밀번호를 함께 데이터베이스에 저장
  await user.save();

  // 해커들이 로직 파악 후, 302 redirect를 프록시로 통해서 막은후 이전 세션데이터를 활용할수 있음
  // 안전하게 session을 destroy 시킴
  req.session.destroy();

  //비밀번호 변경완료 된후, login 페이지로 redirect시킴
  return res.redirect("/login");
};
```

#### [bcrypt](https://www.npmjs.com/package/bcrypt)

```js
// 비밀번호 비교
//pasword : 입력한 비밀번호
//user.passwordHash : 데이터베이스에 존재하는 hash된 비밀번호
const match = await bcrypt.compare(password, user.passwordHash);
```

#### [`Model.findByIdAndUpdate()`](https://mongoosejs.com/docs/api.html#model_Model.findByIdAndUpdate)

`findByIdAndUpdate`로는 `pre('save')`를 실행시키지 않기 때문에 비밀번호가 해시화되지 않고 DB에 저장되게 됨.
그래서 `save()`메서드를 통해 `pre('save')`를 실행시켜 비밀번호를 해시화한 후 DB에 저장될 수 있도록 해줌

#### [`Model.prototype.save()`](https://mongoosejs.com/docs/api.html#model_Model-save)

`findByIdAndUpdate`를 이용해서 Document업데이트 후 save하기
앞서 했던 것처럼 `findByIdAndUpdate`를 통해 Document를 업데이트 시키고 업데이트된 최신 Document를 받아서 save이 가능함
(자바스크립트로 진행한다면 $set은 사용하지 않아도 됨)

```js
const updatedUser = await User.findByIdAndUpdate(
  loggedInUser?._id,
  { $set: { password: newPassword } },
  { new: true }
);
await updatedUser?.save();
```

## 8.6 File Uploads part One / 8.7 File Uploads part Two

1. middleware 생성
   `export const uploadFiles = multer({ dest: "uploads/" });`
   - `dest: "uploads/"` 이기때문에 자동으로 root에서 uploads 폴더가 생성됨
   - 웹페이지에서 업로드 시키는 파일의 정보가 updloads 폴더에 쌓이게됨
2. view 에서 filed을 받아올 form을 multer 양식에 맞게 수정
   ```js
   form(method="POST", enctype="multipart/form-data") //인코딩타입 추가 꼭 필요
   label(for="avatar") Avatar
   input#avart(type="file", name="avatar", accept="image/*") //파일을 받을 name 꼭 추가
   ```
3. userRouter에 추가
   ```js
   userRouter
     .route("/edit")
     .all(protectMiddleware)
     .get(getEdit)
     .post(uploadFiles.single("avatar"), postEdit);
   // postEdit controller 실행 하기전에 upoadFiles.single실행
   // uploadFiles.single("avatar") : 'avatar'라는 Name 값 한개를 단일 파일을 수락하여 req.file에 저장
   ```
4. userController 의 postEdit에 `req.file`로 값을 받아옴
   ```js
   export const postEdit = async (req, res) => {
   const {
   session: {
     user: { _id, email: originalEmail, username: originUsername },
   },
   body: { name, email, username, location },
   file, //req.file 로 받아옴
   } = req;
   console.log(file)
   ```
5. `console.log(file)` 의 결과값
   ```json
   {
     "fieldname": "avatar", // pug form에 정의된 필드명 (input name)
     "originalname": "cat.png", // 실제 사용자가 업로드한 파일 이름과 확장자
     "encoding": "7bit", //파일의 인코딩 타입
     "mimetype": "image/png", // 파일의 mime 타입
     "destination": "uploads/", // 파일이 저장된 폴더
     "filename": "de8d7b8f9533a1c77dc07bee85698a08", //destination에 저장된 파일 명
     "path": "uploads/de8d7b8f9533a1c77dc07bee85698a08", // 업로드된 파일의 전체 경로
     "size": 2478532 //전체 파일의 Buffer
   }
   ```
6. 업로드 된 파일의 경로를 db와 session에 업데이트
   **DB에는 파일을 저장하지않고 파일 경로를 저장함!!!**(원본은 amazone의 하드드라이브 같은곳에 저장)
   ```js
   const updateUser = await User.findByIdAndUpdate(
     _id,
     {
       avatarUrl: file ? file.path : avatarUrl,
       // upload된 파일이 없으면 (file === undefined) 이므로
       // file 이 존재하면 file.path , 없으면 기존에 session에 존재하는 avatartUrl 값을 가지고옴
       name,
       email,
       username,
       location,
     },
     { new: true }
   );
   req.session.user = updateUser;
   ```
7. 브라우저가 uploads 폴더에 있는 내용을 볼수 있게 해야함
   - 현재 코드에서 브라우저가 서버에 있는 파일에 접근할 수가 없음
   ```js
   // edit-profile.pug
   img((src = "/" + loggedInUser.avatarUrl), (width = "100"), (height = "100"));
   // '/' 을 추가해 절대 경로를 줌
   ```
   - 브라우저가 서버의 어떤 폴더로든 갈 수있게되면 보안상 좋지않음.
   - 브라우저가 어떤 폴더 및 파일을 볼 수 있는지 설정함.
   - [**static fils serving**](#88-static-files-and-recap)를 활성화 시킴
     = 폴더 전체를 브라우저에게 노출 시킴

---

[Multer](https://www.npmjs.com/package/multer)
[한글 번역 버전](https://github.com/expressjs/multer/blob/master/doc/README-ko.md)
Multer는 주로 파일 업로드에 사용되는 multipart/form-data를 처리하기 위한 node.js 미들웨어
주의! Multer는 `multipart(multipart/form-data)`가 아닌 form을 처리하지 않음

> `npm i multer`
>
> `enctype="multipart/form-data"`

**`multer(opts)`**
Multer는 옵션 객체를 허용
가장 기본 옵션인 `dest` 요소는 Multedr에게 파일을 어디로 업로드 할지 알려줌
옵션객체를 생략했다면, 파일은 디스크가 아닌 메모리에 저장될 것

기본적으로 multer는 이름이 중복되는 것을 방지하기 위해 파일의 이름을 재작성함. 필요에 따라 해당 함수는 커스텀마이징 가능
**dest 또는 storage**: 파일을 저장할 위치
**fileFilter**: 어떤 파일을 허용할지 제어하는 함수
**limits**: 업로드된 데이터의 한계
**preservePath**: 파일의 base name 대신 보존할 파일의 전체경로

사용 예시

```js
const express = require("express");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const app = express();

app.post("/profile", upload.single("avatar"), function (req, res, next) {
  // req.file 은 `avatar` 라는 필드의 파일 정보입니다.
  // 텍스트 필드가 있는 경우, req.body가 이를 포함할 것입니다.
});

app.post(
  "/photos/upload",
  upload.array("photos", 12),
  function (req, res, next) {
    // req.files 는 `photos` 라는 파일정보를 배열로 가지고 있습니다.
    // 텍스트 필드가 있는 경우, req.body가 이를 포함할 것입니다.
  }
);

const cpUpload = upload.fields([
  { name: "avatar", maxCount: 1 },
  { name: "gallery", maxCount: 8 },
]);
app.post("/cool-profile", cpUpload, function (req, res, next) {
  // req.files는 (String -> Array) 형태의 객체 입니다.
  // 필드명은 객체의 key에, 파일 정보는 배열로 value에 저장됩니다.
  //
  // e.g.
  //  req.files['avatar'][0] -> File
  //  req.files['gallery'] -> Array
  //
  // 텍스트 필드가 있는 경우, req.body가 이를 포함할 것입니다.
});
```

텍스트 전용 Multipart 폼을 처리해야하는 경우, 사용하는 Multer메소드

- `.single()`, `.array()`, `.fields()`
  **.single(fieldname)**
  이름이 fieldname인 단일 파일을 수락
  단일 파일은 `req.file`에 저장됨

## 8.8 Static Files and Recap

#### [static files serving](https://expressjs.com/en/starter/static-files.html)

[`express.static(root, [options])`](https://expressjs.com/ko/api.html#express.static)

Express에 내장된 미들웨어 기능.
정적 파일을 제공하며 serve-static을 기반으로 함.
root 인수는 static asset을 제공할 root 디렉토리를 지정.
이 함수는 `req.url`을 제공된 root 디렉토리와 결합하여 제공할 파일을 결정.

```js
app.use("/uploads", express.static("_uploads"));
//정적 파일을 제공할 디렉토리 : '/uploads'
// "_uploads"라는 디렉토리에서 정적파일을 제공함

//http://localhost:4000/uploads/'req.file.path'
```

##### 문제점

1. 현재 웹페이지를 실행시키는 서버는 계속 켜 있지않음.
   또한, 서버는 재시작할 때마다 초기화 되기 때문에 파일을 보관하기에 적합하지 않음
   1. 서버가 두개라면? : 웹페이지 실행서버, 이미지파일 보관 서버
   2. 서버가 죽는다면? : 이미지 파일 보관 서버가 죽는다면 데이터는 전부 사라지게 될 터...
2. 데이터 베이스에는 파일을 저장하지 않고 파일위치를 저장함
   1. 원본 파일은 amazone의 하드드라이브 같은 곳에 저장

## 8.9 Video Upload

사용자 정보 내 이미지 수정작업과 동일하게 처리하면됨

1. upload.pug 에 비디오 추가할 수 있게 인풋 추가

```pug
//upload.pug
form(method="POST", enctype="multipart/form-data")
  label(for="video") Video File
  input(type="file", accept="video/*", required, name="video")
```

2. multer사용할 수 있게 미들웨어 생성
   1. 업로드되는 파일 경로지정
   2. 업로드되는 파일 최대사이즈 제한
      아바타 이미지와 비디오를 따로 분리해서 저장하기위해 `dest`를 서로 다른 경로를 가지게함
      `fileSize` 로 1MB로 줌

```js
// middlware.js
export const avartUpload = multer({
  dest: "uploads/avatars/",
  limits: {
    fileSize: 10000000, // 단위는 byte
  },
});
export const videoUpload = multer({
  dest: "uploads/videos/",
  limits: {
    fileSize: 10000000,
  },
});
```

3. `input name="video"`의 하나의 비디오를 받아오는 미들웨어 추가

```js
//video.Router.js
videoRouter
  .route("/upload")
  .all(protectMiddleware)
  .get(getUpload)
  .post(videoUpload.single("video"), postUpload);
```

4. `req.file`로 받아온 비디오에서 path 값을 데이터베이스에 저장

```js
//videoController.js
export const postUpload = async (req, res) => {
  const {
    file: { path: fileUrl },
    body: { title, description, hashtags },
  } = req;
  try {
    await Video.create({
      fileUrl,
      title,
      description,
      hashtags: Video.formatHashTags(hashtags),
    });
    return res.redirect("/");
```

5. 비디오 보여주기 (비디오 상세정보)
   1. `watch`컨트롤러의 반환값으로 `watch.pug`에서 video 정보에서 vidoeUrl 추출하여 화면에 뿌려줌

- `controls` 를 넣어주면, 비디오 컨트롤러 추가됨(일시정지,재생,진도바등 생김)

```pug
//watch.pug
video(src="/" + video.fileUrl, controls)
```

[샘플 비디오 파일](https://sample-videos.com/)

[multer limit](https://www.npmjs.com/package/multer)
`fileSize`: multipart forms의 경우 최대 파일 크기 (단위 : 바이트)

[Byte to MB](https://www.gbmb.org/bytes-to-mb)
1000000 Bytes(백만 Bytes) = 1 MB (in decimal)
1000000 Bytes = 0.95367431640625 MB (in binary)

## 8.10 User Profile

사용자정보(프로필) 을 보자

1. 그전에 header에서 프로필 창으로 가는 경로 수정
   - localsMiddleware을 통해 `req.locals.loggedInUser = req.session.user;`을 저장하고 있기때문에, 현재 `loggedInUser` 로 user 정보를 받고있음
   - user생성시에 Id 값을 따로 생성해서 넣어주지 않기때문에 `_id`로 몽고디비가 자동으로 저장해줌

```pug
li
  a(href=`/users/${loggedInUser._id}`) #{ loggedInUser.username }'s profile
```

2. profile페이지를 렌더링해줄 라우터와 컨트롤러 생성

```js
//userRouter.js
userRouter.get("/:id", see);

//userController.js
export const see = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    return res.render("users/profile", { pageTitle: user.name });
  } catch (e) {
    console.log(e);
    return res.status(404).render("404", { pageTitle: "User Not Found" });
  }
};
```

## 8.11 Video Owner

#### [ObjectId](https://mongoosejs.com/docs/schematypes.html#objectids)

ObjectId는 일반적으로 고유 식별자에 사용되는 특수 유형.
ObjectId는 클래스이고 ObjectId는 객체임. 그러나 종종 문자열로 표시됨. `toString()`을 사용하여 ObjectId를 문자열로 변환하면 24자의 16진수 문자열을 얻음.
`\_someId: Schema.Types.ObjectId`
[Mongoose Typescript ObjectIds및 다른 타입 설정](https://mongoosejs.com/docs/typescript.html#objectids-and-other-mongoose-types)

**스키마에 owner을 추가하기 : user 정보 추가하기**
`ref` : 어느 Model 의 스키마의 ObjectId를 가져올지

```js
// /model/Video.js
const videoSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxLength: 80 },
  fileUrl: { type: String, required: true },
  /* ... */
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});
```

사용하기
비디오를 업로드할때 onwer값도 넣어주기!
`onwer === req.session.user._id` 로 현재 로그인한 사용자 정보를 넣어줌

```js
export const postUpload = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
    file: { path: fileUrl },
    body: { title, description, hashtags },
  } = req;
  try {
    await Video.create({
      owner: _id,
      fileUrl,
      title,
      description,
      hashtags: Video.formatHashTags(hashtags),
    });
    return res.redirect("/");
```

비디오 상세 페이지에서 업로드한 사람(게시자)표시

```js
export const watch = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  const owner = await User.findById(video.owner);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  return res.render("watch", { pageTitle: video.title, video, owner });
};
```

```pug
block content
  div
    p= video.title
    small= video.createdAt
    br
    small 게시자 : #{ owner._id }
```

## 8.12 Video Owner part Two

8.11 에 구현햇던 onwer을 더 짧게 구현하기

```js
export const watch = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  const owner = await User.findById(video.owner);
  console.log(video);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  return res.render("watch", { pageTitle: video.title, video, owner });
};
//console.log(video) 값
{
  meta: { views: 0, rating: 0 },
  _id: new ObjectId("641ab3330741053db4adb64b"),
  title: '토끼',
  fileUrl: 'uploads/videos/72b6bd3ee009cffdc1e01d9c8799095b',
  description: '토기까 굴 속에서?! 무슨일이 일어났나 ?~??!?!??!',
  hashtags: [ '#토끼', '#굴', '#뭐하는' ],
  owner: new ObjectId("641ab08a66f4df8b0069d5f5"),
  createdAt: 2023-03-22T07:50:11.677Z,
  __v: 0
}
```

```js
export const watch = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id).populate("owner");
  console.log(video);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  return res.render("watch", { pageTitle: video.title, video });
};
//console.log(video) 값
{
  meta: { views: 0, rating: 0 },
  _id: new ObjectId("641ab3330741053db4adb64b"),
  title: '토끼',
  fileUrl: 'uploads/videos/72b6bd3ee009cffdc1e01d9c8799095b',
  description: '토기까 굴 속에서?! 무슨일이 일어났나 ?~??!?!??!',
  hashtags: [ '#토끼', '#굴', '#뭐하는' ],
  owner: { // 해당 id의 user정보가 쏙!
    _id: new ObjectId("641ab08a66f4df8b0069d5f5"),
    email: 'rachel2148072@gmail.com',
    username: 'j2h30728',
    socialOnly: true,
    password: '$2b$05$RZBJXU0YPxCmcQ9nLz/KaOpM1W4DdFFmejVqlTKSX3uIanNgSRxuu',
    name: 'j2h30728',
    avatarUrl: 'https://avatars.githubusercontent.com/u/60846068?v=4',
    location: null,
    __v: 0
  },
  createdAt: 2023-03-22T07:50:11.677Z,
  __v: 0
}
```

`watch.pug` 파일도 알맞게 수정!

```pug
// view/watch.pug
if loggedInUser && String(video.owner._id) === String(loggedInUser._id)
  a(href=`${video.id}/edit`) Edit Video &rarr;
  br
  a(href=`${video.id}/delete`) Delete Video &rarr;
```

#### [populate](https://mongoosejs.com/docs/populate.html)

Mongoose에는 `populate()`를 통해 다른 컬렉션의 문서를 참조할 수 있음.
Population은 문서의 지정된 경로를 다른 컬렉션의 문서로 자동 교체하는 프로세스.
단일 문서, 여러 문서, 일반 개체, 여러 일반 개체 또는 쿼리에서 반환된 모든 개체를 채울 수 있음.
`const story = await Story.findOne({ title: 'Casino Royale' }).populate('author');`

#### [Population](https://mongoosejs.com/docs/populate.html#population)

## 8.13 User's Videos

프로필에서 그사람이 올린 비디오들 뛰워주기

1. User 스키마에 videos 추가

- video를 배열로 담기위해 대괄호 안에 넣음

```js
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  /* ... */
  videos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }],
});
```

2. profile페이지 링크에 동작하는 `watch` controller 에서 videos를 Populate 로 relationship 해주기

   ```js
   export const postUpload = async (req, res) => {
     const {
       session: {
         user: { _id },
       },
       file: { path: fileUrl },
       body: { title, description, hashtags },
     } = req;
     try {
       const newVideo = await Video.create({
         owner: _id,
         fileUrl,
         title,
         description,
         hashtags: Video.formatHashTags(hashtags),
       });
       const user = await User.findById(_id);
       user.videos.unshift(newVideo); // 배열앞 인덱스에 추가
       user.save(); // 저장 꾹 => 문제점 : 여기서 userSchema.pre 메서드로 인해서 비밀번호가 해싱이 다섯번됨.
       return res.redirect("/");
     } catch (error) {
       console.log(error);
       return res.status(400).render("upload", {
         pageTitle: "Upload Video",
         errorMessage: error._message,
       });
     }
   };
   ```

3. `profile.pug` 에서 `videos`를 불러오기
   ```js
   each video in user.videos
    +video(video)
   else
    li Sorry nothing found.
   ```

- 문제점!!!!
  - `user.save()` 에는 Pre 트리거가 걸려있음
  - 새로운 비디오를 추가하고, 그 비디오르는 게시자의 user.videos 배열에 추가해준다음, `use.save()`를 실행시키면, `userSchema.pre` 메서드로 인해서 비밀번호가 해싱이 다섯번됨.

## 8.14 Bugfix

```js
userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    //password 가 수정될때만 아래 함수 실행
    this.password = await bcrypt.hash(this.password, 5);
  }
});
```

## 8.15 Conclusions
