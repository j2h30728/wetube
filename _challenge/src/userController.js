/*
You DONT have to import the User with your username.
Because it's a default export we can nickname it whatever we want.
So import User from "./models"; will work!
You can do User.find() or whatever you need like normal!
*/
import User from "./models/User";
import bcrypt from "bcrypt";

// Add your magic here!

export const home = (req, res) => res.render("home", { pageTitle: "HOME" });
export const getJoin = (req, res) => res.render("join", { pageTitle: "JOIN" });
export const postJoin = async (req, res) => {
  const pageTitle = "join";
  const { username, name, password, password1 } = req.body;
  if (password !== password1)
    return res.status(400).render("join", {
      pageTitle,
      errorMassge: "wrong password confirmation",
    });
  const exists = await User.exists({ username });
  if (exists)
    return res
      .status(400)
      .render("join", { pageTitle, errorMassge: "username already taken" });
  try {
    await User.create({
      username,
      name,
      password,
    });
    return res.redirect("/login");
  } catch (error) {
    console.log(error);
    return res.status(400).render("join", {
      pageTitle,
      errorMassge: error._message,
    });
  }
};

export const getLogin = (req, res) =>
  res.render("login", { pageTitle: "LOGIN" });

export const postLogin = async (req, res) => {
  const pageTitle = "Lgoin";
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user)
    return res.render("login", {
      pageTitle,
      errorMassge: "An account with this username does not exists.",
    });
  const isOk = await bcrypt.compare(password, user.password);
  if (!isOk) {
    return res.status(400).render("login", {
      pageTitle,
      errorMassge: "wrong password",
    });
  }
  req.session.loggedIn = true;
  req.session.loggedInUser = user;
  return res.redirect("/");
};
