import express from "express"; // babel로 사용가능 해진 최신문법

const PORT = 4000;
//1. app 만듬
const app = express(); //express application 생성

const handleHome = (req, res) => {
  //   return res.end(); // request를 종료시킴 - 더이상 로딩되지않음: 서버는 브라우저에게 아무것도 보내지않음
  return res.send("I still love"); // 또다른 방법, ("") 안에 메시지도 넣을 수 있음
};
const handleLogin = (req, res) => {
  return res.send("Login here.");
};

app.get("/", handleHome); //누군가가 어떤 route로 get request를 보낸다면, callback 함수실행
app.get("/login", handleLogin);

const handleistening = () =>
  console.log(`Server listening on port http://localhost:${PORT}`);

app.listen(PORT, handleistening);
// app.listen(portnumber,"서버가 시작될 때 작동하는 콜백 함수 : 어떤 port를 listeng할지 얘기해줌")
//서버가 만들어지고 서버가 port 4000을 listening하고 있음
