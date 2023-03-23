# 11 VIDEO PLAYER

## 11.0 Player Setup

[웹팩 개별 엔트리 설정 방법](https://webpack.kr/concepts/entry-points/#separate-app-and-vendor-entries)

개별 엔트리 포인트를 원한다고 webpack에게 알려줌.
엔트리 포인트들 사이에 코드/모듈을 많이 재사용하는 멀티 페이지 애플리케이션은 엔트리 포인트 수가 증가함에 따라 이런 기법의 혜택을 크게 얻을 수 있음.

```js
// webpack.config.js
module.exports = {
  entry: {
    // 여러개의 entry 를 지정할 경우, 객체로 표현
    main: "./src/client/js/main.js",
    videoPlayer: "./src/client/js/videoPlayer.js",
  },
  output: {
    filename: "js/[name].js", // webpack으로 인한 처리가 완료된 파일이 js 폴더에 main.js 와 videoPlayer.js으로 생성됨
  },
};
```

```pug
//layout.pug
// script (scr=main.js)를 변경
block scripts

//watch.pug
block scripts
  script(src="/static/js/videoPlayer.js")
```

## 11.1 Play Pause

## 11.2 Mute and Unmute

## 11.3 Volume

## 11.4 Duration and Current Time

## 11.5 Time Formatting

## 11.6 Timeline

## 11.7 Fullscreen

## 11.8 Controls Events part One

## 11.9 Controls Events part Two

## 11.10 Recap

## 11.11 Styles Recap
