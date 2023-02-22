export const home = (req, res) => res.send("Home page Story");
export const trending = (req, res) => res.send("Story trending");
export const updated = (req, res) => res.send("updated Story");
export const see = (req, res) => res.send(`Watch Story #${req.params.id}`);
export const edit = (req, res) => res.send("edit Story");
export const deleteStory = (req, res) => res.send("delete Story");
