export const trending = (req, res) => res.render("home", { paeTitle: "Home" });
export const search = (req, res) => res.send("");
export const see = (req, res) => res.render("watch", { paeTitle: "Watch" });
export const edit = (req, res) => res.render("edit", { paeTitle: "Edit" });
export const deleteVideo = (req, res) => res.send("delete video");
export const upload = (req, res) => res.send("upload video");
