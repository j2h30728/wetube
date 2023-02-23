const fakeUser = {
  username: "Nicolas",
  loggedIn: true,
};
const videos = [
  {
    title: "First Video",
    rating: 5,
    comments: 2,
    createdAt: "2 minutes ago",
    views: 59,
    id: 1,
  },
  {
    title: "Second Video",
    rating: 5,
    comments: 2,
    createdAt: "2 minutes ago",
    views: 59,
    id: 1,
  },
  {
    title: "Third Video",
    rating: 5,
    comments: 2,
    createdAt: "2 minutes ago",
    views: 59,
    id: 1,
  },
];

export const trending = (req, res) =>
  res.render("home", { pageTitle: "Home", fakeUser, videos });
export const search = (req, res) => res.send("");
export const see = (req, res) => res.render("watch", { paeTitle: "Watch" });
export const edit = (req, res) => res.render("edit", { paeTitle: "Edit" });
export const deleteVideo = (req, res) => res.send("delete video");
export const upload = (req, res) => res.send("upload video");
