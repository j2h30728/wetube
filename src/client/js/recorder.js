const startBtn = document.getElementById("startBtn");
const video = document.getElementById("preview");

let stream;
let recorder;
let videoFile;

const handleDownload = () => {
  const a = document.createElement("a");
  a.href = videoFile;
  a.download = "MyRecording.webm";
  document.body.appendChild(a);
  a.click(); // 사용자가 우클릭해서 영상저장하기 행동을 대신해주는 것
};
const handleStop = () => {
  startBtn.innerText = "Download Recording";
  startBtn.removeEventListener("click", handleStop);
  startBtn.addEventListener("click", handleDownload);
  recorder.stop(); //저장된 데이터의 최종 Blob을 포함하는 datavailable 이벤트가 발생하는 지점에서 기록을 중지함
};

const handleStart = () => {
  startBtn.innerText = "Stop Recording";
  startBtn.removeEventListener("click", handleStart);
  startBtn.addEventListener("click", handleStop);
  recorder = new window.MediaRecorder(stream, { mimeType: "video/webm" }); //  record할 MediaStream이 지정된 MEdiaRecorder개체 만듬

  //MediaRecorder.stop()이 호출되면 녹화가 시작된 이후 또는 datavailable 이벤트가 발생한
  // 마지막 시간 이후 캡쳐된 모든 미디어 데이터가 Blob에 전달됨. 이후 캡처가 종료됨
  recorder.ondataavailable = event => {
    videoFile = URL.createObjectURL(event.data);
    video.srcObject = null;
    video.src = videoFile;
    video.loop = true;
    video.play();
  };
  recorder.start(); // 기록 시작,
};

const init = async () => {
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      audio: false, //녹음
      video: true, //카메라 화면
    });
    /* 스트림 사용 */
    video.srcObject = stream;
    video.play();
  } catch (err) {
    /* 오류 처리 */
  }
};
init();
startBtn.addEventListener("click", handleStart);
