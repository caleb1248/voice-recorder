// Import stylesheets
import './style.css';

// Write TypeScript code!
const appDiv = document.getElementById('controls');
const startStopButton = document.getElementById('startStop');
const useVideo = location.search.includes('video');
const countdownElement = document.getElementById('countdown');

document.querySelector('#toggleVideo').onclick = () => {
  if (useVideo) {
    location.search = '';
  } else location.search = '?video';
};
if (useVideo) document.querySelector('#buttons').classList.add('vertical');

let media;
let recorder;

const mediaPlayer = document.createElement(useVideo ? 'video' : 'audio');
mediaPlayer.controls = true;

let url;

function wait1sec() {
  return new Promise((resolve) => setTimeout(resolve, 1000));
}

async function countdown() {
  countdownElement.classList.add('visible');
  countdownElement.textContent = '3';
  await wait1sec();
  countdownElement.textContent = '2';
  await wait1sec();
  countdownElement.textContent = '1';
  await wait1sec();
  countdownElement.textContent = '';
  countdownElement.classList.remove('visible');
}

async function activateMedia() {
  media = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: useVideo,
  });

  if (useVideo) {
    mediaPlayer.width = 320;
    mediaPlayer.height = 240;
    mediaPlayer.srcObject = media;
    mediaPlayer.play();
  }

  recorder = new MediaRecorder(media);
  recorder.addEventListener('dataavailable', (e) => {
    if (url) URL.revokeObjectURL(url);
    url = mediaPlayer.src = URL.createObjectURL(e.data);
    appDiv.appendChild(mediaPlayer);
  });
}

async function startRecording() {
  try {
    await activateMedia();
  } catch {
    alert('Microphone access denied.');
    return;
  }

  startStopButton.textContent = 'Stop';
  startStopButton.onclick = stopRecording;

  if (!useVideo) mediaPlayer.pause();
  if (useVideo) {
    mediaPlayer.muted = true;
    mediaPlayer.play();
    mediaPlayer.controls = false;
    appDiv.appendChild(mediaPlayer);

    await countdown();
  }

  if (recorder.state !== 'recording') recorder.start();
}

async function stopRecording() {
  if (recorder) recorder.stop();
  if (media) media.getTracks().forEach((track) => track.stop());
  startStopButton.textContent = 'Record';
  startStopButton.onclick = startRecording;
  mediaPlayer.pause();
  mediaPlayer.srcObject = null;
  mediaPlayer.muted = false;
  mediaPlayer.controls = true;
}

window.startRecording = startRecording;
window.stopRecording = stopRecording;

stopRecording();
