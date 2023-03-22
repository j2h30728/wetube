import User from "../models/User";
import bcrypt from "bcrypt";
import fetch from "node-fetch";
import Video from "../models/Video";

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
  res.render("login", { pageTitle: "Login", socialOnly: false });

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

// 사용자가 정보요청 수락시 실행
export const finishGithubLogin = async (req, res) => {
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SECRET,
    code: req.query.code, // 요청 수락시 만료기간이 존재하는 임시 code를 query로 줌
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;

  // access token 받기
  const tokenRequest = await (
    await fetch(finalUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();

  // access token 받는 것을 성공할 경우
  if ("access_token" in tokenRequest) {
    const { access_token } = tokenRequest;
    const apiUrl = "https://api.github.com";

    //userdata 를 받아옴
    const userData = await (
      await fetch(`${apiUrl}/user`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
    ).json();
    console.log(userData);
    //private로 설정되어 userdata에서 받아오지못한 email을 해당 코드를 통해, email list를 불러옴
    const emailData = await (
      await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    //이메일 리스트 배열을 순회해서 primary와 verified값이 true 인 email 검색
    const emailObj = emailData.find(
      email => email.primary === true && email.verified === true
    );
    //유효한 이메일이 없다면 로그인창에 에러메시지와 함게 리다이렉트
    if (!emailObj) {
      return res.redirect("/login");
    }
    let user = await User.findOne({ email: emailObj.email });
    if (!user) {
      // 데이터베이스에 동일한 이메일을 가진 유저가 없을 경우(실제 회원가입/소셜로그인까지 합한것)
      user = await User.create({
        name: userData.name ? userData.name : userData.login,
        username: userData.login,
        email: emailObj.email,
        password: "",
        socialOnly: true,
        avatarUrl: userData.avatar_url ? userData.avatar_url : null,
        location: userData.location,
      });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
  } else {
    //엑세스 토큰을 받지못할 경우,
    return res.redirect("/login");
  }
};

export const logout = (req, res) => {
  req.session.destroy();
  return res.redirect("/");
};
export const getEdit = (req, res) => {
  return res.render("edit-profile", { pageTitle: "Edit Profile" });
};
export const postEdit = async (req, res) => {
  const {
    session: {
      user: { _id, email: originalEmail, username: originUsername, avatarUrl },
    },
    body: { name, email, username, location },
    file,
  } = req;
  console.log("file", file);
  console.log("avarturl", avatarUrl);

  if (originUsername !== username) {
    const exists = await User.exists({ username });
    if (exists) {
      return res.status(400).render("edit-profile", {
        pageTitle: "Edit Profile",
        errorMessage: "이미존재하는 username 입니다.",
      });
    }
  }
  if (originalEmail !== email) {
    const exists = await User.exists({ email });
    if (exists) {
      return res.status(400).render("edit-profile", {
        pageTitle: "Edit Profile",
        errorMessage: "이미존재하는 email 입니다.",
      });
    }
  }
  const updateUser = await User.findByIdAndUpdate(
    _id,
    {
      avatarUrl: file ? file.path : avatarUrl,
      name,
      email,
      username,
      location,
    },
    { new: true }
  );
  req.session.user = updateUser;
  return res.redirect("/users/edit");
};

export const getChangePassword = (req, res) => {
  if (req.session.socialOnly === true) {
    return res.redirect("/");
  }
  return res.render("users/change-password", { pageTitle: "Change Password" });
};
export const postChangePassword = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
    body: { oldPassword, newPassword, newPasswordConfirm },
  } = req;
  const user = await User.findById({ _id });
  const ok = await bcrypt.compare(oldPassword, user.password);
  if (!ok) {
    return res.status(404).render("users/change-password", {
      pageTitle: "Change Password",
      errorMessage: "The current password is incorrect.",
    });
  }
  if (oldPassword === newPassword) {
    return res.status(404).render("users/change-password", {
      pageTitle: "Change Password",
      errorMessage: "The old password equals newpassword.",
    });
  }
  if (newPassword !== newPasswordConfirm) {
    return res.status(404).render("users/change-password", {
      pageTitle: "Change Password",
      errorMessage: "The password does not match the confirmation.",
    });
  }
  user.password = newPassword;
  await user.save(); // 비밀번호를 다섯번 해싱하는 pre 함수 트리거시킴 userSchema.pre("save",..)
  req.session.destroy(); // 안전하게 세션을 제거
  return res.redirect("/login");
};
export const remove = (req, res) => res.send("remove my profile");

export const see = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).populate("videos");
    return res.render("users/profile", { pageTitle: user.name, user });
  } catch (e) {
    console.log(e);
    return res.status(404).render("404", { pageTitle: "User Not Found" });
  }
};
