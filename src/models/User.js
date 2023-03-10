import mongoose from "mongoose";
import bcrypt from "bcrypt";

//소셜로그인 시에는 비밀번호가 없기 때문
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  socailOnly: { type: Boolean, default: false },
  password: { type: String },
  name: { type: String, required: true },
  location: String,
});

//save 하기전에 입력한 비밀번호를 5번 해싱하고 저장
userSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 5);
});

const User = mongoose.model("User", userSchema);
export default User;
