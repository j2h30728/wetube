console.log("video player");

const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const time = document.getElementById("time");
const volumeRange = document.getElementById("volume");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const timeLine = document.getElementById("timeLine");

let volumeValue = 0.5;
video.volume = volumeValue;

const formatTime = seconds =>
  new Date(seconds * 1000).toISOString().substring(11, 19);

const handlePlayClick = () => {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
  playBtn.innerText = video.paused ? "Play" : "Pause";
};

const handleMute = () => {
  if (video.muted) {
    video.volume = volumeValue;
    if (volumeValue !== 0) video.muted = false;
  } else {
    video.muted = true;
    video.volume = 0;
  }
  muteBtn.innerText = video.muted ? "Unmute" : "Mute";
  volumeRange.value = video.muted ? 0 : volumeValue;
};
const handleVolumeChange = event => {
  const {
    target: { value },
  } = event;
  if (video.muted) video.muted = false;
  volumeValue = Number(value);
  video.volume = volumeValue;
  muteBtn.innerText = volumeValue === 0 ? "Unmute" : "Mute";
};
const handleLoadedMetadata = () => {
  totalTime.innerText = formatTime(Math.floor(video.duration)); // 비디오의 전체길이
  timeLine.max = Math.floor(video.duration);
};
const handleTimeUpdate = () => {
  currentTime.innerText = formatTime(Math.floor(video.currentTime)); // 비디오의 현재 플레이되고있는 시간
  timeLine.value = Math.floor(video.currentTime);
};
const handleTimeLineChange = event => {
  const {
    target: { value },
  } = event;
  video.currentTime = value;
  video.play();
};
playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMute);
volumeRange.addEventListener("input", handleVolumeChange);
timeLine.addEventListener("input", handleTimeLineChange); // 타임라인 레인지바를 움직일때
video.addEventListener("loadedmetadata", handleLoadedMetadata); //비디오외의 것이 로딩되면
video.addEventListener("timeupdate", handleTimeUpdate); //재생될때 (video.currentTime 이 변경될때)
