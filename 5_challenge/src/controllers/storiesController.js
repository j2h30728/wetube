export const home = (req, res) =>
  res.render("home", { pageTitle: "Home입니다." });
export const trending = (req, res) => res.render("<h1>trending</h1>");
export const newStories = (req, res) => res.render("<h1>newStories</h1>");
export const seeStory = (req, res) =>
  res.render(`<h1>seeStory: ${req.params.id}</h1>`);
export const editStory = (req, res) =>
  res.render(`<h1>editStory: ${req.params.id}</h1>`);
export const deleteStory = (req, res) =>
  res.render(`<h1>deleteStory: ${req.params.id}</h1>`);
