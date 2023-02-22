export const trending = (req, res) => res.send("Home page video");
export const search = (req, res) => res.send("Search");
export const see = (req, res) => res.send(`Watch Video #${req.params.id}`);
export const edit = (req, res) => res.send("edit video");
export const deleteVideo = (req, res) => res.send("delete video");
export const upload = (req, res) => res.send("upload video");
