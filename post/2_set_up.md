# 2 SET UP

## 2.0 Your First NodeJS Project

1. 폴더생성 : mkdir
2. package.json 생성 (이름 변경 불가)
   **json** : 프로그래머가 파일에 정보를 저장하기 위해 만든 방식 중 하나. 파일에 정보를 입력하는 방식
   nodeJS프로젝트를 만들때 제일 먼저 만들어야 하는 것
   1. npm init
      npm이 package.json을 만들어주는 것을 도와줌
   2. main : 프로젝트의 대표 파일이 무엇인지
      만들고 배포한 package를 다른 사람들이 설치하면 main을 사용할 것 (필수아님)
   3. 시작 - package.json / index.js

## 2.1 Installing Express

#### package.json

node 를 사용해서 파일을 실행시키지 않고 package.json을 이용해서 실행시킴
**package.json은 프로젝트를 동작시킬때 필요한 모듈들에 대한 정보를 담겨져 있음**
package.json 내에있는 파일 중 옵셔널 : main, author, description 등
**scripts** : 실행하고 싶은 것.
**dependecies** : 패키지가 작동되려면 필요한 패키지들

1. packagep.json파일에서 "script" 내용 추가
2. package.json 실행 : `npm run ___`

서버를 실행하는 script,CSS를 압축하는 script, 웹시아티를 빌드하고 서버에 배포하는 script등 많은 script 추가할 것

#### 서버만들기 - express 사용

1. `npm i express` : express + express의 dependencies도 같이 다운 받음
2. node_modules 폴더 생성됨 : npm으로 설치한 모든 패키지가 저장됨
   express 를 사용할때 다른 패키지도 필요함 : dpendencies
   (npm 이 dependencies의 dpendencies...의..의.. 설치해줌 )
3. package.json 에 npm이 자동으로 추가해줌
   == 이 프로젝트를 사용하기 위해서는 express가 있어야 한다.
   ```json
   "dependencies": {
    "express": "^4.18.2"
   }
   ```

## 2.2 Understanding Dependencies

**`npm install`**
: npm이 package.jsonㅇ을 보고 dependecies를 찾아, 그 안에 있는 모듈들을 알아서 설치함

package-lock.json
: 패키지들을 안전하게 관리해줌.
packaage.json + package-lock.json + index.js 를 가지고 `npm i`를 하게되면 동일한 버전의 모듈들을 설치하게됨(코드가 확실하게 동작한다는 의미

`.gitignore` : 원하는 파일을 깃허브에 올라가지 않게함

## 2.3 The Tower of Babel

#### Babel : 자바스크립트 컴파일러

아직 nodeJS가 이해하지 못하는 최신 자바스크립트 코드 존재

1. nodeJS가 이해하는 자바스크립트를 사용
2. babel을 사용 : 최신 자바스크립트로 컴파일해줌

#### [NodeJS에서 필요한 babel설치](https://babeljs.io/setup#installation)

1. `npm install --save-dev @babel/core`
   ```json
     "devDependencies": {
   "@babel/core": "^7.20.12"
     }
   ```

- **devDependencies** : 개발자에게 필요한 dependencies, babel: 최신문법을 사용하기 위함 (운전을 더 잘하기 위한것)
  - `--save-dev`
- **dependencies** : 프로젝트를 실행시키기 위해 필요한 dependencies(자동차를 굴리기위한 가솔린)

2. `npm install @babel/preset-env --save-dev` 실행
   `babel.config.json`파일 생성 : touch babel.config.json
   생성후, 파일에 아래의 코드 기입
   [**@babel/preset-env**](https://babeljs.io/docs/en/babel-preset-env)
   : 환경에 필요한 구문 변환을 세부적으로 관리할 필요 없이 최신 JavaScript를 사용할 수 있게 해주는 스마트한 플러그인

   ```json
   {
     "presets": ["@babel/preset-env"]
   }
   ```

   ```json
     "devDependencies": {
    "@babel/core": "^7.20.12",
    "@babel/preset-env": "^7.20.2"
   }
   ```

## 2.4 Nodemon

직접 자바스크립트내에 babel 컴파일 코드를 작성하지않고 package.json 파일내에 babel로 컴파일하는 script를 생성

#### nodemond

: 우리가 만든 파일이 수정되는 것을 감시해주는 패키지. 파일이 수정되면 nodemon 이 자동으로 실행해줌
(수정할때마다 npm run dev 안해도됨)
**설치**

1. `npm install @babel/core @babel/node --save-dev`
   package.json 파일내에서, "win" : "node index.js"에서 아래의 코드로 수정필요
   ```json
   "scripts": {
       "dev": "babel-node index.js"
   },
   ```
2. `npm i nodemon --save-dev`
   --exec 옵션 뒤에 babel-node index.js 써서 실행하게 만듬
   ```json
   "scripts": {
   "dev": "nodemon --exec babel-node index.js"
   },
   ```

` "nodemon --exec babel-node index.js"`

1. node index.js : index.js 실행
2. babel-node node index.js : babel이 nodeJS를 싱행하게 만들어서 최신 자바스크립트 문법코드로 index.js를 실행시킴
3. nodemone --exec babel-node index.js : 파일을 수정할때마다 npm run dev를 칠필요없이 파일을 재시작해줌
