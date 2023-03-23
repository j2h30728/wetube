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
// script (scr=main.js)를 아래코드로 변경
block scripts

//watch.pug
// 비디오 상세페이지에서 videoPlyaer.js를 불러옴
block scripts
  script(src="/static/js/videoPlayer.js")
```

## 11.1 Play Pause

비디오(자바스크립트)를 만들기 전에 html 마크업 필요

### [HTMLMediaElement](https://developer.mozilla.org/ko/docs/Web/API/HTMLMediaElement)

HTMLMediaElement는 오디오와 비디오에 통용되는 미디어 관련 확장성을 제공하기 위해 HTMLElement에 메소드와 프로퍼티를 추가한 인터페이스임.
HTMLVideoElement 와 HTMLAudioElement (en-US) 는 이 인터페이스를 상속함.

#### 속성 properties

이 인터페이스는 HTMLElement, Element, Node, and EventTarget의 프로퍼티들도 모두 상속함

- `HTMLMediaElement.paused` : 미디어 일시정지 여부를 boolean 값으로 반환 함
- `HTMLMediaElement.volume` : 오디오 볼륨을 double 값으로 반환. 0.0(무음)에서 1.0(최대크기) 사이 값을 가짐
- `HTMLMediaElement.muted` : 오디오 음소거 여부를 boolean 값으로 반환함. 음소거라면 true, 반대는 false를 반환함

#### 메서드 Method

- `HTMLMediaElement.pause()` : 미디어 재생을 일시정지함
- `HTMLMediaElement.play()` : 미디어 재생함

#### 이벤트

- `ended` : `(<audio> or <video>)` 미디어가 끝까지 재생 완료 된 시점에 발생
- `pause` : 미디어 일시 정지를 요청하고 paused 상태로 진입하는 시점에 발생. 일반적으로 `HTMLMediaElement.pause()` 메소드가 호출되는 시점
- `play` : `HTMLMediaElement.play()` 메소드 호출이나 autoplay 속성에 의해 paused 프로퍼티가 true 에서 false로 전환되는 시점에 발생
- `playing` : 일시정지 되거나 버퍼 부족으로 재생 정지 된 이후 재생가능한 시점
- `volumechange` : 볼륨이 변경되는 시점에 발생함

#### [HTMLVideoElement](https://developer.mozilla.org/ko/docs/Web/API/HTMLVideoElement)

HTMLVideoElement 인터페이스는 Video object를 조작하는데 필요한 프로퍼티와 메소드를 제공함.
HTMLMediaElement와 HTMLElement를 상속함

## 11.2 Mute and Unmute

## 11.3 Volume

[`input type="range`"에 사용 가능한 이벤트 (change, input)](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/range)

이벤트: `change`
change 이벤트는 요소 변경이 끝나면 발생
텍스트 입력 요소인 경우에는 요소 변경이 끝날 때가 아니라 포커스를 잃을 때 이벤트가 발생

이벤트: `input`
input 이벤트는 사용자가 값을 수정할 때마다 발생
키보드 이벤트와 달리 input 이벤트는 어떤 방법으로든 값을 변경할 때 발생

## 11.4 Duration and Current Time

## 11.5 Time Formatting

## 11.6 Timeline

## 11.7 Fullscreen

## 11.8 Controls Events part One

## 11.9 Controls Events part Two

## 11.10 Recap

## 11.11 Styles Recap
