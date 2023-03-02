import User from "../models/User";

export const login = (req, res) => res.render("login", { pageTitle: "Login" });
export const getJoin = (req, res) => {
  return res.render("join", { pageTitle: "JOIN" });
};
export const postJoin = async (req, res) => {
  const { username, email, password, name, location } = req.body;
  try {
    await User.create({
      username,
      email,
      password,
      name,
      location,
    });
    return res.redirect("/login");
  } catch (error) {
    console.log(error);
    return res.render("404", { pageTitle: "error" });
  }
};
export const logout = (req, res) => res.send("log out");
export const edit = (req, res) => res.send("edit my profile");
export const remove = (req, res) => res.send("remove my profile");
export const see = (req, res) => res.send("see user");
