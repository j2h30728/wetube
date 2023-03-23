# 9 WEBPACK

## 9.0 Introduction to Webpack

이때까지 node.js는 백엔드에서 사용하는 자바스크립트 == 서버사이드렌더링에 필요한 코드
아직 프론트엔드에서 사용하는 자바스크립트는 작성하지 않음
프론트엔드에서 사용하는 자바스크립트? == 클라이언트렌더링에 필요한 코드

- 비디어플레이어 꾸미기

## 9.1 Webpack Configuration part One

`package.json` 에서 프론트엔드와 백엔드에 필요한 패키지를 한 번에 정리함

### webpack

아래의 압축, 변형, 최소화 등 필요한 작업들을 거치고 정리된 코드를 결과물로 보여줌

- .jpg => 압축된 .jog
- JS => 모든 브라우저가 읽을수있는 버전의 JS
- Sass는 브라우저가 읽을수 이씨도록 css

#### Wepback 설치

webpack과 webpack cli설치
`npm i webpack webpack-cli -D`
[Webpack 시작하기](https://webpack.kr/guides/getting-started/)
[Webpack 설정](https://webpack.kr/concepts/configuration/)

[Typescript환경에서 Webpack 설정하기](https://webpack.kr/guides/typescript/)
`npm install --save-dev typescript ts-loader webpack webpack-cli`

_webpack아 여기는 소스파일들이 있고 여기는 너(webpack)가 결과물을 보낼 폴더야_ 라는 정도만 webpack에게 전달하면됨

1. webpack.config.js 생성
   1. 오래된 버전의 Javascript이해. common JS 이해
   2. `modlue.exports ={}` 로 사용
2. 두가지 필수 설정 사항
   1. entry : 우리가 변경(처리)하고자 파는 파일. 경로와 함께 씀 (신문법 작성된 js파일) - `./src/client/js/main.js`
   2. ouput : 결과물
      1. filename : 처리하고자하는 파일 이름 - `main.js`
      2. path: 처리하고나온 결과물을 어디에 저장할 것인지 - `절대경로`
3. package.json 수정
   1. script에 추가
      `"assets" : "webpack --config webpack.config.js"`

```js
//webpack.config.js
module.exports = {
  entry: "./src/client/js/main.js",
  output: {
    filename: "main.js",
    path: "./assets/js",
  },
};
```

```json
  "scripts": {
    "dev": "nodemon --exec babel-node src/init.js",
    "assets": "webpack --config webpack.config.js"
  },
```

## 9.2 Webpack Configuration part Two

파트를 모아 절대경로를 만들어줌
`path.resolve(__dirname, "" ,.....)`

`npm i babel-loader`

[**`path.resolve([...paths])`**](https://nodejs.org/api/path.html#pathresolvepaths)
path.resolve() 메서드는 경로 세그먼트 시퀀스를 절대 경로로 해석하는 데 사용됨.
경로 세그먼트가 전달되지 않으면 `path.resolve()`는 현재 작업 디렉토리의 절대 경로를 반환함.
(\_\_dirname: 현재 파일 위치의 절대 경로)

```js
path.resolve("/foo/bar", "./baz");
// Returns: '/foo/bar/baz'
```

[babel-loader](https://github.com/babel/babel-loader)
`npm install babel-loader -D`
: babel 및 webapck 을 사용해 javascript 파일을 변환 할 수 있음

[webpack loader](https://webpack.kr/loaders/)
webpack의 loaders를 사용하면 파일을 전처리 할 수 있음.
Javascript를 넘어 모든 정적 리소스를 번들링할 수 있음

- [Loaders](https://webpack.kr/concepts/loaders)
  - 로더는 모듈의 소스 코드에 변경사항을 적용함
  - 파일을 `import`하거나 "로드"할 때 전처리 할수 있음
  - 다른 빌드 도구의 "태스크"와 유사하며 프런트엔드 빌드 단계를처리하는 방법을 제공
  - 로더는 파일을
    - TYpescript와 같은 언어 => javascript로 변환하거나
    - 인라인 이미지 => 데이터 url로 로드할 수있음
    - javascript 모듈에서 직접 CSS파일을 `import`하는 작업도 수행 가능

[webpack babel-loader](https://webpack.kr/loaders/babel-loader/)

main.js에 빈 파일 나오는 오류 해결 방법
mode를 설정해주지 않으면 기본적으로 production으로 설정되어 client/js폴더 내에 작성한 main.js를 변환했을 때, 빈 파일로 나올 수 있음.
빈 파일이 나올 경우, module.export안에 `mode: "development"`로 설정해주면됨

[Typescript webpack.config.js 설정](https://webpack.kr/guides/typescript/)

```js
const path = require("path");

module.exports = {
  entry: "./src/client/js/main.js", // 변경하고 싶은 파일
  mode: "development", // 설정하지않으면 자동으로 Production으로 되어 코드를 압축 시킴. 개발중에는 압축없이 내가 어떻게 코드 짜고있는 지 확인하기위해 'development'로 씀
  //production 이면, 한줄로 코드를 압축시킴
  output: {
    filename: "main.js", // 처리된 파일명
    path: path.resolve(__dirname, "assets", "js"), // 처리된 파일이 저장될 절대 경로
  },
  module: {
    rules: [
      {
        test: /\.js$/, //파일 확장자
        use: {
          loader: "babel-loader", //어떤 로더 써서 자스를 전처리 시킬것인가
          options: {
            presets: [["@babel/preset-env", { targets: "defaults" }]],
          },
        },
      },
    ],
  },
};
```

## 9.3 Webpack Configuration part Three

client 폴더 : webpack이 처리하기전의 파일
assets 폴더 : webpack이 실행되고 난 다음 만들어진 파일들

모든 Pug 파일들이 babel-loader로 처리된 JAvascript 에 접근가능함

```js
//server.js
// express 메서드를 사용해 "assets"폴더에 접근 가능하게 함
app.use("/static", express.static("assets"));
//assets 폴더 접근을 허하노라, 이름이 서로 동일할 필요는 없음
```

서버에게 "assets폴더의 내용물을`/static`주소를 통해 공개하라!" 전달함

```pug
//layout.pug
// pug파일들이 main.js 에 접근할 수 있게됨
script(src="/static/js/main.js")
```

아래의 코드로 인해서 localhost:400 접속시 `alert("hi")`가 나옴

```js
alert("hi");
```

매번 폴더를 지우고 생성하는 script
`"assets": "rimraf assets &&  webpack --config webpack.config.js"`

webpack이 계속 코드를 주시하고 변경시 자동으로 complie됨
-> 아래의 코드 : 1000ms(매초)마다 변화를 감지하고 이를 5000ms(5초)뒤에 리빌딩 해줌

```js
//webpack.config.js 의 module.exports안에 넣어주기
watch: true,
watchOptions: {
ignored: /node_modules/,
aggregateTimeout: 5000, // 리빌딩할때의 딜레이 타임(ms단위)
poll: 1000, //변화를 감지하는 시간 (ms단위)
},
```

## 9.4 SCSS Loader

loader : 파일들을 변환하는 장치

**sass, sass-loader, css-loader, style-loader 설치**
`npm i sass sass-loader css-loader style-loader -D`

#### [sass-loader](https://webpack.js.org/loaders/sass-loader/)

Sass/SCSS 파일을 로드하고 CSS로 컴파일함

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
      },
    ],
  },
};
```

1. `use: ["style-loader", "css-loader", "sass-loader"],`
2. sass-loader => css-loader => style-loader 순으로 loader가 적용됨
   1. sass-loader : scss확장자 파일을 브라우저가 이해할수있는 css로 변환 (Input: Sass, Output: CSS)
   2. css-loader : @import, url() 등의 최신형 CSs코드를 브라우저가 이해할수 있는 코드로 변환 (Input: CSS, Output: JavaScript)
   3. style-loader : 1,2 과정으로 변환시킨 css 코드를 DOM내부에 적용 (Input: JavaScript, Output: JavaScript).
3. 변환된 코드가 Output 에서 설정한 파일 경로에 설정된 파일명으로 저장됨
   1. ```js
        output: {
            filename: "main.js", // 처리된 파일명
            path: path.resolve(__dirname, "assets", "js"), // 처리된 파일이 저장될 절대 경로
      },
      ```
4. 저장된 변환 JS 코드를 pug 파일에서 사용하고 적용시키기위해 코드작성
   1. `app.use("/static", express.static("assets"));` in server.js
   2. `script(src="/static/js/main.js")` in layout.pug

#### [SCSS](https://sass-lang.com/documentation/variables)

Variable
Sass 변수는 간단함.
`$`로 시작하는 이름에 값을 할당하면 값 자체 대신 해당 이름을 참조할 수 있음

```scss
$base-color: #c6538c;
$border-dark: rgba($base-color, 0.88);

.alert {
  border: 1px solid $border-dark;
}
```

#### [@import](https://developer.mozilla.org/en-US/docs/Web/CSS/@import)

@import CSS at-rule은 다른 스타일 시트에서 스타일 규칙을 가져오는 데 사용됩니다.

[SCSS에서의 import](https://sass-lang.com/documentation/at-rules/import#plain-css-imports)

## 9.5 MiniCssExtractPlugin

분리된 css 파일을 넣고싶음
javascript 가 로딩되는 것을 기다리기 싫고 바로 화면에 띄우고 싶기 때문

[MiniCssExtractPlugin](https://webpack.kr/plugins/mini-css-extract-plugin/)
이 플러그인은 CSS를 별도의 파일로 추출함.(css파일을 분리할 수 있게 됨)
`style-loader` 를 대체해서 넣음
CSS가 포함된 JS 파일별로 CSS 파일을 생성함.
mini-css-extract-plugin을 css-loader와 결합하는 것이 좋음.
`npm install --save-dev mini-css-extract-plugin`

[MiniCssExtractPlugin Options](https://webpack.js.org/plugins/mini-css-extract-plugin/#publicpath)

```js
plugins: [new MiniCssExtractPlugin({ filename: "css/style.css" })];
```

[CssMinimizerWebpackPlugin](https://webpack.kr/plugins/css-minimizer-webpack-plugin/)

```pug
html(lang="ko")
  head
    link(rel="stylesheet", href="/static/css/styles.css")

  script(src="/static/js/main.js")
```

`webpack.config.js` 파일내에 `MiniCssExtraPlugin` 추가

- plugins 을 추가한뒤 옵션으로 생성되는 css 파일이름을 지정
- style.loader와 대체됨

```js
const path = require("path");
const MiniCssExtraPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: "./src/client/js/main.js",
  mode: "development",
  plugins: [new MiniCssExtraPlugin({ filename: "css/styles.css" })],
  output: {
    filename: "js/main.js",
    path: path.resolve(__dirname, "assets"),
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [MiniCssExtraPlugin.loader, "css-loader", "sass-loader"],
      },
    ],
  },
```

## 9.6 Better Developer Experience

#### Watch and WatchOptions

Webpack은 파일이 변경될 때마다 이를 감지하여 다시 컴파일 할 수 있습니다.

### [watch](https://webpack.kr/configuration/watch/)

watch 모드를 킴.
초기 빌드 후 webpack은 해석 된 파일의 변경 사항을 계속 감시함. (webpack.config.js에 entry에 지정한 파일을 감시함)

### [Nodemon](https://github.com/remy/nodemon)

nodemon은 디렉토리의 파일 변경이 감지되면 노드 응용 프로그램을 자동으로 다시 시작하여 node.js 기반 응용 프로그램을 개발하는 데 도움이 되는 도구.

[Sample nodemon.json](https://github.com/remy/nodemon/blob/master/doc/sample-nodemon.md)

[Nodemon Config file](https://github.com/remy/nodemon#config-files)

```js
//webpack.config.js
module.exports = {
  watch: true, // entry 파일을 계속 감시함
  output: {
    clean: true, // output 파일과 관련없는 폴더 및 파일은 webpack이 재시작 될때 제거됨
  },
};
```

```json
// nodemon.json
{
  "ignore": ["webpack.config.json", "src/client/*", "assets/*"], // 해당 파일이 업데이트되어도 nodemone은 작동하지않음(백엔드 서버를 재시작시키지않음)
  "exec": "babel-node src/init.js" // 해당 파일들을 실행시킴
}
```

```json
//package.json
  "scripts": {
    "dev:server": "nodemon", // nodemon.json 을 찾아서 실행시킴
    "dev:assets": "rimraf assets &&  webpack" // webpack.config.json 을 찾아서 실행
  },
```

1. 명령어 없이 webpack을 계속 실행시킴 (refresh+complie)
   1. `watch:true`
   2. `npm i dev:assets` 이후 명령어가 추가로 필요하지않음
2. `nodemon.json` 설정파일
   1. `ignore` 추가해서 webpack파일을 저장할때마다 Nodemon이 감지하고 백엔드를 재시작하지 않게 함
3. package.json 에서 코드 정리
   1. 해당되는 모듈의 config.json 파일을 찾아서 실행시키게함

- 프론트(webpack)과 백엔드(nodemon)실행 콘솔은 반드시 분리하고 동시에 실행시키기

## 9.7 Recap
