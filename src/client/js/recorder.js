import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

const actionBtn = document.getElementById("actionBtn");
const video = document.getElementById("preview");

let stream;
let recorder;
let videoFile;

const files = {
  input: "recording.webm",
  output: "output.mp4",
  thumb: "thumbnail.jpg",
};

const downloadFile = (fileUrl, fileName) => {
  const a = document.createElement("a");
  a.href = fileUrl;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
};

const handleDownload = async () => {
  //1
  const ffmpeg = createFFmpeg({
    log: true,
  }); // { log: true } : 무슨일이 벌어지고 있는지 콘솔에서 확인하고 싶음
  await ffmpeg.load(); //사용자가 소프트웨를 사용할 것이기 때문. 사용자가 무언가를 설치해서 javascript 가 아닌 코드를 사용함.
  //== 우리 웹사이트에서 다른 프로그램을 사용함. 소프트웨어가 무거울 수 있기때문에 기다려 줘야함

  //2. ffmpeg 파일 만들기
  //우리가 브라우저 안에 있다는 생각을 멈춤. 파일로가득한 컴퓨터 안에있다고 상상
  // ffmpeg 세계에서 파일을 생성해야하기 때문

  //ffmpeg의 가상의 세계에 파일을 생성해줌
  //ffmpeg.FS("writeFile", fileName, binary data)
  //binary data = 상상을 파일을 만드려면 0과1의 정보를 줘야함  === videoFile(Blob:....)
  //await fetchFile(videoFile) 을 통해 videoFile을 페칭하고있음
  //videoRecorder에서 온 데이터를 가지고 fetchFile(vidoeFile) 을 통해 파일을 만들어 냄
  ffmpeg.FS("writeFile", files.input, await fetchFile(videoFile));

  // '-i' == input
  // 가상컴퓨터에 이미 존재하는 files.input을 파일을 input으로 받고 files.output로 변환됨
  //  "-r", "60", : 영상을 초당 60프레임으로 인코딩해주는 명령. 더 빠른 영상 인코딩을 가능하게 해줌
  await ffmpeg.run("-i", files.input, "-r", "60", files.output);

  // 썸네일 제작
  // '-ss' : 영상의 특정 시간대로 갈 수 있게해줌
  // "-ss", "00:00:01", : 영상의 1초로 가겠다!
  // "-frames:v", "1" : 첫 프레임의 스크린샷을 찍어달라/ 이동한 시간의 스크린샷 한장 찍기
  //  files.thumb 로 파일이 만들어지고 이 파일은 파일시스템(FS)의 메모리에 만들어짐 == "[fferr]       encoder         : Lavc58.91.100 mjpeg"
  await ffmpeg.run(
    "-i",
    files.input,
    "-ss",
    "00:00:01",
    "-frames:v",
    "1",
    files.thumb
  );

  //.mp4 로 변환한 파일 가져오기
  //브라우저가 아닌 컴퓨터에서 작업하는 것과 비슷함
  // 파일시스템에서 생성된 파일을 읽어들임
  // 이 파일은 Unit8Array(array of 8-bit undigned integers:양의 정수)타입이 될 것
  const mp4File = ffmpeg.FS("readFile", files.output); //output.mp4 파일 불러오기
  const mp4Blob = new Blob([mp4File.buffer], { type: "video/mp4" }); // 불러온 output.mp4 버퍼데이터를 mp4 타입의 Blob 생성
  const mp4Url = URL.createObjectURL(mp4Blob); //Blob URL 생성 -> file 다운 가능해짐

  const thumbFile = ffmpeg.FS("readFile", files.thumb);
  const thumbBlob = new Blob([thumbFile.buffer], { type: "image/jpg" });
  const thumbUrl = URL.createObjectURL(thumbBlob);

  downloadFile(mp4Url, "MyRecording.mp4");
  downloadFile(thumbUrl, "MyThumbnail.jpg");

  ffmpeg.FS("unlink", files.input);
  ffmpeg.FS("unlink", files.output);
  ffmpeg.FS("unlink", files.thumb);

  URL.revokeObjectURL(mp4Url);
  URL.revokeObjectURL(thumbUrl);
  URL.revokeObjectURL(videoFile);
};

const handleStart = () => {
  actionBtn.innerText = "Recording";
  actionBtn.disabled = true;
  actionBtn.removeEventListener("click", handleStart);

  recorder = new window.MediaRecorder(stream, { mimeType: "video/webm" }); //  record할 MediaStream이 지정된 MEdiaRecorder개체 만듬

  //MediaRecorder.stop()이 호출되면 녹화가 시작된 이후 또는 datavailable 이벤트가 발생한
  // 마지막 시간 이후 캡쳐된 모든 미디어 데이터가 Blob에 전달됨. 이후 캡처가 종료됨
  recorder.ondataavailable = event => {
    console.log(event.data);
    videoFile = URL.createObjectURL(event.data);
    video.srcObject = null;
    video.src = videoFile;
    video.loop = true;
    video.play();

    actionBtn.innerText = "Download";
    actionBtn.disabled = false;
    actionBtn.addEventListener("click", handleDownload);
  };
  recorder.start(); // 기록 시작,
  setTimeout(() => {
    recorder.stop();
  }, 5000);
};

const init = async () => {
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      audio: false, //녹음
      video: {
        width: 1024,
        height: 576,
      }, //카메라 화면
    });
    /* 스트림 사용 */
    video.srcObject = stream;
    video.play();
  } catch (err) {
    /* 오류 처리 */
  }
};
init();
actionBtn.addEventListener("click", handleStart);
