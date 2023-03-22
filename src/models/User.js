import mongoose from "mongoose";
import bcrypt from "bcrypt";

//소셜로그인 시에는 비밀번호가 없기 때문
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  socialOnly: { type: Boolean, default: false },
  password: { type: String },
  name: { type: String, required: true },
  avatarUrl: String,
  location: String,
  videos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }],
});

//save 하기전에 입력한 비밀번호를 5번 해싱하고 저장
// 여기서 this 는 저장되는 USER객체
userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    //password 가 수정될때만 아래 함수 실행
    this.password = await bcrypt.hash(this.password, 5);
  }
});

const User = mongoose.model("User", userSchema);
export default User;
