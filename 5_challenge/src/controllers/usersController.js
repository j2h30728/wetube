export const join = (req, res) =>
  res.render("<h1>join</h1>", { pageTitle: "join" });
export const login = (req, res) => res.render("<h1>login</h1>");
export const seeUsers = (req, res) => res.render("<h1>seeUsers</h1>");
export const seeUser = (req, res) =>
  res.render(`<h1>seeUser: ${req.params.id}</h1>`);
export const editProfile = (req, res) => res.render("<h1>editProfile</h1>");
