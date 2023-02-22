import express from "express";
import morgan from "morgan";

const PORT = 4000;
const app = express();
const logger = morgan();

const methodLogger = (req, res, next) => {
  console.log(`method ${req.method}`); // method GET
  next();
};
const routerLogger = (req, res, next) => {
  console.log(`PATH ${req.path}`); // PATH /
  next();
};
const handleHome = (req, res) => {
  return res.send("I love middleware");
};
const handleLogin = (req, res) => {
  return res.send("login");
};
// app.use(methodLogger, routerLogger);
app.use(logger);
app.get("/", handleHome);
app.get("/login", handleLogin);

const handleistening = () =>
  console.log(`Server listening on port http://localhost:${PORT}`);

app.listen(PORT, handleistening);
