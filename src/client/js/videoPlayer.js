console.log("video player");

const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const playBtnIcon = playBtn.querySelector("i");
const muteBtn = document.getElementById("mute");
const muteBtnIcon = muteBtn.querySelector("i");
const time = document.getElementById("time");
const volumeRange = document.getElementById("volume");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");
const videoContainer = document.getElementById("videoContainer");
const fullScreenBtn = document.getElementById("fullScreen");
const fullScreenBtnIcon = fullScreenBtn.querySelector("i");
const videoControls = document.getElementById("videoControls");

let controlsTimeout = null; // mousemove, mouseleave 이벤트핸들러에서 모두 사용하기위해 Global 변수로 선언
let controlsMovementTimeout = null; // 비디오 위에서 마우스를 정지시킬경우 classList.remove("showing")함소를 setTimout 로 실행. 다시 움직일 경우 해당 함수를 clearTimeout시키기고 새로운 setTimeout의 반환값을 저장하기위해, setTimeout의 반환값을 global변수로 저장해놓은것
let volumeValue = 0.5;
video.volume = volumeValue;

const formatTime = seconds =>
  new Date(seconds * 1000).toISOString().substring(14, 19);

const handlePlayClick = () => {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
  playBtnIcon.classList = video.paused ? "fas fa-play" : "fas fa-pause";
};

const handleMuteClick = () => {
  if (video.muted) {
    //getter
    video.volume = volumeValue;
    if (volumeValue !== 0) video.muted = false;
  } else {
    video.muted = true; //setter
    video.volume = 0;
  }
  muteBtnIcon.classList = video.muted
    ? "fas fa-volume-mute"
    : "fas fa-volume-up";
  volumeRange.value = video.muted ? 0 : volumeValue;
};
const handleVolumeChange = event => {
  const {
    target: { value },
  } = event;
  if (video.muted) video.muted = false;
  volumeValue = Number(value);
  video.volume = volumeValue;
  muteBtnIcon.classList =
    volumeValue === 0 ? "fas fa-volume-mute" : "fas fa-volume-up";
};
const handleLoadedMetadata = () => {
  totalTime.innerText = formatTime(Math.floor(video.duration)); // 비디오의 전체길이
  timeline.max = Math.floor(video.duration);
};
const handleTimeUpdate = () => {
  currentTime.innerText = formatTime(Math.floor(video.currentTime)); // 비디오의 현재 플레이되고있는 시간
  timeline.value = Math.floor(video.currentTime);
};
const handleTimeLineChange = event => {
  const {
    target: { value },
  } = event;
  video.currentTime = value;
  video.play();
};
const handleFullScreen = () => {
  const fullScreenElement = document.fullscreenElement;
  if (fullScreenElement) {
    document.exitFullscreen();
    fullScreenBtnIcon.classList = "fas fa-expand";
  } else {
    videoContainer.requestFullscreen();
    fullScreenBtnIcon.classList = "fas fa-compress";
  }
};

const hideControls = () => videoControls.classList.remove("showing");

const handleMouseMove = () => {
  //비디오화면위에서 마우스를 움직이면 해당함수는 계속 호출되어 실행됨
  if (controlsTimeout) {
    clearTimeout(controlsTimeout);
    controlsTimeout = null;
  }
  if (controlsMovementTimeout) {
    clearTimeout(controlsMovementTimeout);
    controlsMovementTimeout = null;
  }
  videoControls.classList.add("showing");
  controlsMovementTimeout = setTimeout(hideControls, 3000); // 비디오화면 위에서 마우스를 정지시킬때 3초뒤 controls 숨김
};
const handleMouseLeave = () => {
  controlsTimeout = setTimeout(hideControls, 3000);
};
const handlePlayWithSpacebar = event => {
  if (event.code === "Space") {
    handlePlayClick();
  }
};
const handleMuteWithM = event => {
  if (event.code === "KeyM") {
    handleMuteClick();
  }
};
const handleEnded = () => {
  const { id } = videoContainer.dataset;
  fetch(`/api/videos/${id}/view`, {
    method: "POST",
  });
};
playBtn.addEventListener("click", handlePlayClick);
video.addEventListener("click", handlePlayClick); //비디오만 눌러도 재생
muteBtn.addEventListener("click", handleMuteClick);
volumeRange.addEventListener("input", handleVolumeChange);
video.addEventListener("loadedmetadata", handleLoadedMetadata); //비디오외의 것이 로딩되면
video.addEventListener("timeupdate", handleTimeUpdate); //재생될때 (video.currentTime 이 변경될때)
video.addEventListener("ended", handleEnded);
videoContainer.addEventListener("mousemove", handleMouseMove);
videoContainer.addEventListener("mouseleave", handleMouseLeave);
timeline.addEventListener("input", handleTimeLineChange); // 타임라인 레인지바를 움직일때
fullScreenBtn.addEventListener("click", handleFullScreen);
document.addEventListener("keyup", handlePlayWithSpacebar); // spacebar 누르면 재생정지
document.addEventListener("keyup", handleMuteWithM); // m 누르면 뮤트
