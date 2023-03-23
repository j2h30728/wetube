# 10 STYLES

## 10.0 Introduction

[Reset CSS](https://meyerweb.com/eric/tools/css/reset)

[FontAwesome CDN](https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css)

## 10.1 Styles part One

## 10.2 Styles part Two

## 10.3 Styles Conclusions

#### [Populating across multiple levels (Double populate)](https://mongoosejs.com/docs/populate.html#deep-populate)

여러 단계에 걸쳐 populating할 수 있음.
예) 유저 안에, 비디오 안에, 유저를 가져올 때 사용가능

```js
User.findOne({ name: "Val" }).populate({
  path: "friends",
  // Get friends of friends - populate the 'friends' array for every friend
  populate: { path: "friends" },
});
```

사용자정보창(프로필페이지)에서 띄워줄 비디오에게

- 유저가 게시한 비디오 필요 : `populate('video')`
- 그 비디오를 표시하는 `mixins/video.pug`파일에서 필요한 비디오 게시자에 대한 정보 필요

2중 populate 진행

```js
//userController.js
export const see = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).populate({
    path: "videos", // 첫 populate
    populate: {
      path: "owner", // 두번째 populate
      model: "User", // 두번째 populate의 model 을 알려줌
    },
  });
  return res.render("users/profile", {
    pageTitle: user.name,
    user,
  });
};
```

```pug
// mixins/video.pug
mixin video(video)
  a.video-mixin(href=`/videos/${video.id}`)
    .video-mixin__thumb
    .video-mixin__data
      span.video-mixin__title= video.title
      .video-mixin__meta
        span #{ video.owner.name } •
        span #{ video.meta.views } 회
```
