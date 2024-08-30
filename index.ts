// Import stylesheets
import './style.css';
(function () {
  var script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/eruda';
  document.body.append(script);
  script.onload = function () {
    eruda.init();
  };
})();

// Write TypeScript code!
const appDiv: HTMLElement = document.getElementById('controls');

let media: MediaStream;
let recorder: MediaRecorder;

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

async function record() {
  if (!media) {
    try {
      await activateMedia();
    } catch {
      alert('Microphone access denied.');
      return;
    }
  }
  if (recorder.state !== 'recording') recorder.start();
}

async function stop() {
  if (recorder) recorder.stop();
}

window.record = record;
window.stop = stop;
