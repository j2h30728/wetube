# 12 VIEWS API

## 12.0 Register View Controller

## 12.1 Register View Event

[ended event](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/ended_event)
audio 또는 video 미디어가 끝까지 *재생 완료 된 시점*에 발생함.
ended 이벤트는 미디어(오디오나 비디오)의 끝 부분에 도달했거나 더 이상 사용할 수 있는 데이터가 없어서 재생 또는 스트리밍이 중지되면 시작됨

[HTMLMediaElement](https://developer.mozilla.org/ko/docs/Web/API/HTMLMediaElement)

[Data Attributes](https://developer.mozilla.org/ko/docs/Learn/HTML/Howto/Use_data_attributes)
화면에 안 보이게 글이나 추가 정보를 엘리멘트에 담아 놓을 수 있음.

- HTML5 특정 요소와 연관되어 있지만 확정된 의미는 갖지 않는 데이터에 대한 확장 가능성을 염두에 두고 디자인되었음.
- `data-*` 속성은 표준이 아닌 속성이나 추가적인 DOM 속성, `Node.setUserData()`과 같은 다른 조작을 하지 않고도, 의미론적 표준 HTML 요소에 추가 정보를 저장할 수 있도록 해줌.

사용예시

```html
<article
  id="electriccars"
  data-columns="3"
  data-index-number="12314"
  data-parent="cars">
  ...
</article>
```

```js
var article = document.getElementById("electriccars");

article.dataset.columns; // "3"
article.dataset.indexNumber; // "12314"
article.dataset.parent; // "cars"
```

---

```pug
//- view/watch.pug
block content
  #videoContainer(data-id=video._id) 
//-   video._id 를 외부에서 보이지않게 담아서 videoPlayer.js에서 사용할수있게함
```

```js
// /client/js/videoPlayer.js
const handleEnded = () => {
  const { id } = videoContainer.dataset;
  fetch(`/api/videos/${id}/view`, {
    method: "POST",
  });
};
video.addEventListener("ended", handleEnded);
```

1. video의 재생이 모두 완료되면, `handleEnded`콜백함수가 실행됨
2. `videoContainer.datase.id`에서 `id`을 가져와 POST 요청을 보냄

## 12.2 Conclusions

`.status(200)` : `render()` 하기 전에 상태 코드를 정할 수 있음
`.sendStatus(200)`: 상태를 보내고 연결을 끊음
