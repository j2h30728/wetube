import mongoose from "mongoose";

mongoose.set("strictQuery", false);
mongoose.connect("mongodb://127.0.0.1:27017/challnge", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
const handleOpen = () => console.log("✅ Connected to DB");
const handleError = error => console.log("❌ DB Error", error);

db.on("error", handleError); // error가 발생할 때 마다 실행됨
db.once("open", handleOpen); // 서버가 연결될 때 딱 한번 실행됨
