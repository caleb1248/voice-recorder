// Import stylesheets
import './style.css';

// Write TypeScript code!
const appDiv = document.getElementById('controls');
const startStopButton = document.getElementById('startStop');

let media;
let recorder;

const audioElement = document.createElement('audio');
audioElement.controls = true;

let url;

async function activateMedia() {
  media = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: false,
  });

  recorder = new MediaRecorder(media);
  recorder.addEventListener('dataavailable', (e) => {
    if (url) URL.revokeObjectURL(url);
    url = audioElement.src = URL.createObjectURL(e.data);
    appDiv.appendChild(audioElement);
  });
}

async function startRecording() {
  try {
    await activateMedia();
  } catch {
    alert('Microphone access denied.');
    return;
  }

  if (recorder.state !== 'recording') recorder.start();
  startStopButton.textContent = 'Stop';
  startStopButton.onclick = stopRecording;
  audioElement.pause();
}

async function stopRecording() {
  if (recorder) recorder.stop();
  if (media) media.getTracks().forEach((track) => track.stop());
  startStopButton.textContent = 'Record';
  startStopButton.onclick = startRecording;
}

window.startRecording = startRecording;
window.stopRecording = stopRecording;

stopRecording();
