// Import stylesheets
import './style.css';

// Write TypeScript code!
const appDiv = document.getElementById('controls');
const startStopButton = document.getElementById('startStop');

let media;
let recorder;

const audioElement = appDiv.appendChild(document.createElement('audio'));
audioElement.controls = true;

async function activateMedia() {
  media = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: false,
  });

  recorder = new MediaRecorder(media);
  recorder.addEventListener('dataavailable', (e) => {
    audioElement.src = URL.createObjectURL(e.data);
  });
}

async function startRecording() {
  if (!media) {
    try {
      await activateMedia();
    } catch {
      alert('Microphone access denied.');
      return;
    }
  }
  if (recorder.state !== 'recording') recorder.start();
  startStopButton.textContent = 'Stop';
  startStopButton.onclick = stopRecording;
}

async function stopRecording() {
  if (recorder) recorder.stop();
  startStopButton.textContent = 'Record';
  startStopButton.onclick = startRecording;
}

window.startRecording = startRecording;
window.stopRecording = stopRecording;

stopRecording();
