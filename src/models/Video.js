import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxLength: 80 },
  fileUrl: { type: String, required: true },
  description: { type: String, required: true, trim: true, minLength: 10 },
  createdAt: { type: Date, default: Date.now, trim: true, required: true },
  hashtags: [{ type: String, trim: true }],
  meta: {
    views: { type: Number, default: 0, required: true },
  },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

// model 이 만들어 지기 전에 미들웨어를 만들어야함
// videoSchema.static("formatHashTags", function (hashtags) {
//   return hashtags
//     .split(",")
//     .map(word => (word.startsWith("#") ? word : `#${word}`));
// });
videoSchema.statics.formatHashTags = function (hashtags) {
  return hashtags
    .split(",")
    .map(word => (word.startsWith("#") ? word : `#${word}`));
};

const Video = mongoose.model("Video", videoSchema);
export default Video;
