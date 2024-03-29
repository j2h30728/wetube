# 5 TEMPLATES

## 5.0 Returning HTML

#### HTML 리턴

1. 텍스트로 HTML을 리턴
   => HTML 전체를 텍스트로 보내기에는 코드량이 너무 많으며, header, footer 내용과 같이 동일하게 들어가는 코드를 계속 복사붙여넣기 해서 텍스트를 넣을수가 없음

```tsx
//텍스트로 HTML을 보내는 경우
const treding = (req, res) => res.send("<h1>Hello</h1>");
```

2. Template engine 사용

## 5.1 Configuring Pug

### [Pug](https://www.npmjs.com/package/pug)

Pug는 Haml의 영향을 많이 받은, Node.js 및 브라우저용 JavaScript로 구현된 고성능 템플릿 엔진.
Pug는 이전에 "Jade"로 알려졌음. 그러나 "Jade"가 등록상표임이 밝혀져 이름을 변경함

1. pug 설치
   `npm i pug` : express에게 html 헬퍼로 pug를 사용하겠다는 의미

2. view engine으로 pug를 선택
   `app.set('view engine', 'pug')`
   - 기본적으로 Express는 views폴더안에 있는 파일을 찾음
     - process.cwd() + '/views
       (cwd : current working directory)
     - process.cwd() 는 현재 node.js를 실행한 경로이며, package.json 파일이 존재하는 경로임
   - 뷰 === 유저가 보는 대상

[Express와 함께 템플리트 엔진을 사용](https://expressjs.com/ko/guide/using-template-engines.html)
Express가 템플리트를 렌더링하려면 다음과 같은 애플리케이션 설정이 필요함
**views**, template 파일들이 있는 디렉토리.
`app.set('views', process.cwd() + '/src/views')`
**view engine**, 사용할 template engine 설정
`app.set('view engine', 'pug')`

3. 실제로 pug파일을 생성 후 연결
   `export const 컨트롤러이름 = (req,res) => res.render(pug 파일 이름)`

```js
//server.js : view engine 및 경로 설정
app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");

//controller
export const trending = (req, res) => res.render("home");

// home.pug
doctype html
html(lang="ko")
    head
        title Wetube
    body
        h1 Welcome to Wetube
        footer &copy; 2021 Wetube
```

[Application Settings (Express어플리케이션 설정)](https://expressjs.com/ko/4x/api.html#app.use)

## 5.2 Partials

중복되는 엘리먼트를 따로 관리할 수 있음(리액트 기준으로는 컴포넌트화 시킬 수 있다는 말)

```pug
footer &copy; #{ new Date().getFullYear() } Wetube
```

`include partials/footer.pug` 로 partials를 가져옴

```pug
doctype html
html(lang="ko")
  head
    title Wetube
  body
    h1 Welcome to Wetube
    include partials/footer.pug
```

## 5.3 Extending Templates

### [Template Inheritance](https://pugjs.org/language/inheritance.html)

Pug는 템플릿 상속을 지원함
템플릿 상속은 block과 extends키워드를 통해 사용
템플릿의 block에는 하위 템플릿을 대체할 수 있음

`block 000` 으로 빈공간을 만들고
`extends 베이스pug파일.pug`로 상속(확장)시킨후, `blcok 000`으로 받아와 해당하는 공간에 넣을 컨텐츠를 채움
`block`을 채우는것은 필수는 아님. 아무것도 넣지 않아도됨
=>>`block` : custom HTML을 넣기위한 곳

```pug
doctype html
html(lang="ko")
  head
    block head
  body
    block content
  include partials/footer.pug
```

```pug
extends base.pug

block head
  title Home | Wetube

block content
  h1 Home
```

## 5.4 Variables to Templates

pug에서 필요한 변수는 controller에서 보내줌

```pug
doctype html
html(lang="ko")
  head
    title #{ pageTitle } | Wetube
  body
    block content
  include partials/footer.pug
```

`export const 컨트롤러이름 = (req, res) => res.render(pug파일이름, {pug에서 필요한 변수명 : 넣고싶은 내용 })`

```js
export const trending = (req, res) => res.render("home", { pageTitle: "Home" });
export const see = (req, res) => res.render("watch", { pageTitle: "Watch" });
export const edit = (req, res) => res.render("edit", { pageTitle: "Edit" });
```

## 5.5 Recap

## 5.6 MVP Styles

### MVP.css

callsName, frameworks 없이, 순수 HTML elements 을 꾸며줌
`<link rel="stylesheet" href="https://unpkg.com/mvp.css@1.12/mvp.css">`

```pug
doctype html
html(lang="ko")
  head
    title #{ pageTitle } | Wetube
    link(rel="stylesheet", href="https://unpkg.com/mvp.css@1.12/mvp.css")
```

## 5.7 Conditionals

`h1=pageTitle` : pageTitle을 text가 아닌 variable로 인식
`h1 pageTitle` : h1엘리먼트의 단순한 'pageTitle'이라는 text
`h1 #{pageTitle}` : 이렇게 쓰지않는 이유는 variable을 text와 섞어서 쓰고있지않기 때문(text와 섞어 쓰려고 #{}를 쓰는것!)

```pug
doctype html
html(lang="ko")
  head
    title #{ pageTitle } | Wetube
    link(rel="stylesheet", href="https://unpkg.com/mvp.css@1.12/mvp.css")
  body
    header
      h1= pageTitle

    main
  include partials/footer.pug
```

### [Conditionals](https://pugjs.org/language/conditionals.html)

pug의 first-class conditional syntax는 optional parentheses(선택적 괄호)을 허용함

```js
const fakeUser = {
  username: "Nicolas",
  loggedIn: true,
};

export const trending = (req, res) =>
  res.render("home", { pageTitle: "Home", fakeUser });
```

pug에서도 if else 구문 사용 가능

```pug
doctype html
html(lang="ko")
  head
    title #{ pageTitle } | Wetube
    link(rel="stylesheet", href="https://unpkg.com/mvp.css")
  body
    header
      if fakeUser.loggedIn
        small Hello #{ fakeUser.username }
      nav
        ul
          if fakeUser.loggedIn
            li
              a(href="/logout") Log out
          else
            li
              a(href="/login") Login
      h1= pageTitle
    main
      block content
  include partials/footer.pug
```

[pug홈페이지 예시 코드](https://pugjs.org/language/conditionals.html)

```pug
- var user = { description: "foo bar baz" };
- var authorised = false;
#user
  if user.description
    h2.green Description
    p.description= user.description
  else if authorised
    h2.blue Description
    p.description.
      User has no description,
      why not add one...
  else
    h2.red Description
    p.description User has no description
```

## 5.8 Iteration

Itreation : 기본적으로 elemnts의 list를 보여주는 것

#### [Iteration (반복)](https://pugjs.org/language/iteration.html)

Pug는 each와 while라는 두 가지 기본 반복 방법을 지원

```pug
ul
each val in [1, 2, 3, 4, 5]
li= val
```

배열이나 객체에 반복할 값이 없으면 실행될 `else` 블록을 추가 가능

```pug
- var values = [];
ul
each val in values
li= val
else
li There are no values
```

## 5.9 Mixins

partial와 같은 류
데이터를 받을 수 있는 미리 만들어진 HTML block (=== 공통컴포넌트)

#### [Mixins](https://pugjs.org/language/mixins.html)

Mixin을 사용하면 재사용 가능한 Pug 블록을 만들 수 있음
또한 Mixindm은 함수로 컴파일되며 인수를 사용할 수 있음

```pug
//- Declaration
mixin list
  ul
    li foo
    li bar
    li baz
//- Use
+list
+list
```

공식 홈페이지에서의 Mixins 예시

```pug
mixin pet(name)
  li.pet= name
ul
  +pet('cat')
  +pet('dog')
  +pet('pig')
```

```html
<ul>
  <li class="pet">cat</li>
  <li class="pet">dog</li>
  <li class="pet">pig</li>
</ul>
```

```pug
mixin article(title)
  .article
    .article-wrapper
      h1= title
      if block
        block
      else
        p No content provided

+article('Hello world')

+article('Hello world')
  p This is my
  p Amazing article
```

```html
<div class="article">
  <div class="article-wrapper">
    <h1>Hello world</h1>
    <p>No content provided</p>
  </div>
</div>
<div class="article">
  <div class="article-wrapper">
    <h1>Hello world</h1>
    <p>This is my</p>
    <p>Amazing article</p>
  </div>
</div>
```

Mixins 으로 변경하는 순서

1. 한 곳에 작성한 home.pug

```pug
//home.pug
extends base.pug

block content
  h2 Welcome here you will see the trending videos
  div
    each video in videos 
      h4= video.title
      ul
        li #{ video.rating }/5.
        li #{ video.comments } comments.
        li Posted #{ video.createdAt }.
        li #{ video.views } views.
    else
      li li Sorry nothing found
```

2. mixins/video.pug 로 분리하여 video mixin 생성

```pug
mixin video(info)
  div
    h4= info.title
    ul
      li #{ info.rating }/5.
      li #{ info.comments } comments.
      li Posted #{ info.createdAt }.
      li #{ info.views } views.
```

3. 생성한 video mixin을 home.pug 로 불러옴

```pug
extends base.pug
include mixins/video

block content
h2 Welcome here you will see the trending videos
div
  each eachVideo in videos 
  +video(eachVideo)

  else
  li li Sorry nothing found
```

## 5.10 Recap

`each .. in .. ...else `

```pug
//home.pug
extends base.pug

block content
  h2 Welcome here you will see the trending videos
  div
    each video in videos  // videos.length > 0
      h4= video.title
      ul
        li #{ video.rating }/5.
        li #{ video.comments } comments.
        li Posted #{ video.createdAt }.
        li #{ video.views } views.
    else // videos.length === 0
      li li Sorry nothing found
```

- iteration : list 의 모든 element들을 HTML에 보여주는 것
- mixin : 다른 데이터를 포함하지만 같은 형태의 HTML을 보여주는 것
