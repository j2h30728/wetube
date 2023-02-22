import express from "express";

const app = express();
const urlLogger = (req, res, next) => {
  console.log(`Path: ${req.path}`);
  next();
};
const timeLogger = (req, res, next) => {
  const now = new Date();
  console.log(
    `Time: ${now.getFullYear()}.${now.getMonth() + 1}.${now.getDate()}`
  );
  next();
};
const securityLogger = (req, res, next) => {
  if (req.protocol === "https") {
    console.log("Secure");
  }
  console.log("Insecure");
  next();
};
const protectorMiddleware = (req, res, next) => {
  req.path === "/protected" ? res.end() : next();
};
app.use(urlLogger, timeLogger, securityLogger, protectorMiddleware);
app.get("/", (req, res) => res.send("<h1>Home</h1>"));
app.get("/protected", (req, res) => res.send("<h1>Protected</h1>"));
// Codesandbox gives us a PORT :)
app.listen(4000, () => `Listening!✅`);
