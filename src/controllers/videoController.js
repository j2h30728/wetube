let videos = [
  {
    title: "First Video",
    rating: 5,
    comments: 2,
    createdAt: "2 minutes ago",
    views: 1,
    id: 1,
  },
  {
    title: "Second Video",
    rating: 2,
    comments: 444,
    createdAt: "2 minutes ago",
    views: 59,
    id: 2,
  },
  {
    title: "Third Video",
    rating: 1,
    comments: 26,
    createdAt: "5 minutes ago",
    views: 59,
    id: 3,
  },
];
export const trending = (req, res) =>
  res.render("home", { pageTitle: "Home", videos });
export const search = (req, res) => res.send("");
export const watch = (req, res) => {
  const { id } = req.params;
  const video = videos[id - 1];
  return res.render("watch", { pageTitle: `Watching ${video.title}`, video });
};
export const getEdit = (req, res) => {
  const { id } = req.params;
  const video = videos[id - 1];
  return res.render("edit", { pageTitle: "Edit", video });
};
export const postEdit = (req, res) => {
  const { id } = req.params;
  const title = req.body.title;
  videos[id - 1].title = title; // 데이터베이스와 연결하면 해당 코드는 변경됨. 역할은 동일함.
  return res.redirect(`/videos/${id}`);
};
export const deleteVideo = (req, res) => res.send("delete video");
export const getUpload = (req, res) =>
  res.render("upload", { pageTitle: "Upload Viedo" });
export const postUpload = (req, res) => {
  const { title } = req.body;
  const newVideo = {
    title,
    rating: 0,
    comments: 0,
    createdAt: "just now",
    views: 0,
    id: videos.length + 1,
  };
  videos.push(newVideo);
  return res.redirect("/");
};
