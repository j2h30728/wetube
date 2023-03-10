import User from "../models/User";
import bcrypt from "bcrypt";
import fetch from "node-fetch";

export const getJoin = (req, res) => {
  return res.render("join", { pageTitle: "JOIN" });
};
export const postJoin = async (req, res) => {
  const pageTitle = "join";
  const { username, email, password, password2, name, location } = req.body;
  if (password !== password2) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "Password confirmation does not match.",
    });
  }
  const exists = await User.exists({ $or: [{ username }, { email }] });
  if (exists) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "This username/email is already taken.",
    });
  }
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
    return res.status(400).render("join", {
      pageTitle: "Join",
      errorMessage: error._message,
    });
  }
};
export const getLogin = (req, res) =>
  res.render("login", { pageTitle: "Login" });

export const postLogin = async (req, res) => {
  const { username, password } = req.body;
  // 존재하지 않는 username 일 경우,
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).render("login", {
      pageTitle: "Login",
      errorMessage: "An account with this username does not exists.",
    });
  }

  // 입력한 비밀번호가 맞는지 확인
  const isOkay = await bcrypt.compare(password, user.password);
  if (!isOkay)
    return res.status(400).render("login", {
      pageTitle: "Login",
      errorMessage: "Wrong password.",
    });
  req.session.loggedIn = true;
  req.session.user = user;
  return res.redirect("/");
};

export const startGithubLogin = (req, res) => {
  const baseUrl = "https://github.com/login/oauth/authorize";
  const config = {
    client_id: process.env.GH_CLIENT,
    allow_signup: false,
    scope: "read:user user:email", //여러개의 sope를 받을때는 공백을 넣어줌
  };
  const params = new URLSearchParams(config).toString(); //'client_id=4c3405ef73df967b3238&allow_signup=false&scope=read%3Auser+user%3Aemail'
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
};
export const finishGithubLogin = async (req, res) => {
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SECRET,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  const tokenData = await fetch(finalUrl, {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
  });
  const tokenRequest = await tokenData.json();
  if ("access_token" in tokenRequest) {
    const { access_token } = tokenRequest;
    const userInfoData = await fetch("https://api.github.com/user", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    const userRequest = await userInfoData.json();
    console.log(userRequest);
  } else {
    return res.redirect("/login");
  }
};

export const logout = (req, res) => res.send("log out");
export const edit = (req, res) => res.send("edit my profile");
export const remove = (req, res) => res.send("remove my profile");
export const see = (req, res) => res.send("see user");
