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
- `HTMLMediaElement.duration` : 미디어 전체 길이를 초단위로 double값으로 반환. 재생 가능한 미디어가 없을 경우 0으로 반환함

#### 메서드 Method

- `HTMLMediaElement.pause()` : 미디어 재생을 일시정지함
- `HTMLMediaElement.play()` : 미디어 재생함

#### HTMLMediaElement 이벤트

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

#### input rage 이벤트

- `change`
  change 이벤트는 요소 변경이 끝나면 발생
  텍스트 입력 요소인 경우에는 요소 변경이 끝날 때가 아니라 포커스를 잃을 때 이벤트가 발생
  (마우스클릭을 똈을 떼, 드래그를 풀었을 때)

- `input`
  input 이벤트는 사용자가 값을 수정할 때마다 발생
  키보드 이벤트와 달리 input 이벤트는 어떤 방법으로든 값을 변경할 때 발생

## 11.4 Duration and Current Time

#### HTMLMediaElement 속성 properties

- `HTMLMediaElement.duration` : 미디어 전체 길이를 초단위로 double값으로 반환. 재생 가능한 미디어가 없을 경우 0으로 반환함
- `HTMLMediaElement.currentTime` : 비디오가 현재 플레이 되고있는 시간

#### HTMLMediaElement 이벤트

loaded meta data

- `meta data`

  - 비디오를 제외한 모든것(비디오의 시간, 가로세로크기)
  - 비디오에서 움직이는 이미지들을 제외한 모든 엑스트라들

- `loadeddata`
  미디어의 첫번째 프레임이 로딩 완료된 시점에 발생

- `timeupdate`
  currentTime 속성이 변경되는 시점에 발생 : 비디오 시간이 변할 대마다 발생함

[이벤트 발생순서](https://developer.mozilla.org/ko/docs/Web/API/HTMLMediaElement#%EC%9D%B4%EB%B2%A4%ED%8A%B8)
loadedmetadata -> loadeddata -> canplay -> canplaythrough

## 11.5 Time Formatting

[`String.prototype.substring()`](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/String/substring) :string 객체의 시작 인덱스로 부터 종료 인덱스 전 까지 문자열의 부분 문자열을 반환

```js
const str = "Mozilla";

console.log(str.substring(1, 3));
// Expected output: "oz"

console.log(str.substring(2));
// Expected output: "zilla"
```

```js
const formatTime = seconds =>
  new Date(seconds * 1000).toISOString().substring(11, 19);

const handleLoadedMetadata = () => {
  totalTime.innerText = formatTime(Math.floor(video.duration)); // 비디오의 전체길이
  //00:00:00
};
const handleTimeUpdate = () => {
  currentTime.innerText = formatTime(Math.floor(video.currentTime)); // 비디오의 현재 플레이되고있는 시간
  //00:00:29
};
```

## 11.6 Timeline

```pug
input#timeLine(type="range", value="0", step="0.1", min="0")
```

```js
const handleLoadedMetadata = () => {
  timeLine.max = Math.floor(video.duration); //로딩되고 비디오 전체길이를 timeLine 최댓값으로 적용
};
const handleTimeUpdate = () => {
  timeLine.value = Math.floor(video.currentTime); // timeLine값을 변경할때 알맞게 비디오 현재시간을 변경
};
const handleTimeLineChange = event => {
  const {
    target: { value }, // rage input Value 뽑아오기
  } = event;
  video.currentTime = value; // rage input값을 변경할때마다 비디오 현재시각에 맞추어 현재 재생시간을 변경
  video.play(); // 현재 재생시간 변경하고 바로비디오 재생 (디폴트 값은 일시정지)
};
```

## 11.7 Fullscreen

#### [Fullscreen API](https://developer.mozilla.org/ko/docs/Web/API/Fullscreen_API)

Fullscreen API 는 특정 요소 Element(와 해당 자손들을)를 full-screen mode로 표시하고, 더 이상 필요하지 않으면 full-screen mode를 종료하는 메서드를 추가합니다.

- `Element.requestFullscreen()`
  유저 에이전트가 지정한 요소(그리고 그 자손들까지)를 full-screen mode로 설정하고, 브라우저의 모든 UI 요소와 다른 모든 애플리케이션을 화면에서 제거하도록 요구함.
  full-screen mode가 활성화되면 Promise resolved를 반환함.

- `Document.exitFullscreen()`
  user agent 가 full-screen mode에서 창 모드로 다시 전환되도록 요청함.
  full-screen mode가 완전히 종료되면 Promise resolved 를 반환함.

- `DocumentOrShadowRoot.fullscreenElement` (사용 추천)
  fullscreenElement 속성은 DOM(혹은 shadow DOM)에서 현재 full-screen mode로 표시되는 요소Element를 알려줌. 이것이 null인 경우, document는 full-screen mode이 아님.

## 11.8 Controls Events part One

## 11.9 Controls Events part Two

## 11.10 Recap

```js
const handlePlayWithSpacebar = event => {
  if (event.code === "Space") {
    handlePlayClick();
  }
};
const handleMuteWithM = event => {
  if (event.code === "KeyM") {
    handleMuteClick();
  }
};
document.addEventListener("keyup", handlePlayWithSpacebar); // spacebar 누르면 재생정지
document.addEventListener("keyup", handleMuteWithM); // m 누르면 뮤트
```

## 11.11 Styles Recap
