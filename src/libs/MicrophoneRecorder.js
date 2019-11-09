import MediaStreamRecorder from "msr";
// import ConcatenateBlobs from "concatenateblobs";
import AudioContext from "./AudioContext";

let analyser;
let audioCtx;
let mediaRecorder;
let chunks = [];
let startTime;
let stream;
let mediaOptions;
let blobObject;
let onStartCallback;
let onStopCallback;
let onPauseCallback;
let onSaveCallback;
let onDataCallback;
let onBlockCallback;

const constraints = { audio: true, video: false }; // constraints - only audio needed

navigator.getUserMedia =
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia;

export class MicrophoneRecorder {
  constructor(onStart, onStop, onPause, onSave, onData, onBlock, options) {
    onStartCallback = onStart;
    onStopCallback = onStop;
    onPauseCallback = onPause;
    onSaveCallback = onSave;
    onDataCallback = onData;
    onBlockCallback = onBlock;
    mediaOptions = options;
  }

  startRecording = () => {
    startTime = Date.now();

    if (mediaRecorder) {
      if (audioCtx && audioCtx.state === "suspended") {
        audioCtx.resume();
      }

      if (mediaRecorder && mediaRecorder.state === "paused") {
        mediaRecorder.resume();
        return;
      }

      if (audioCtx && mediaRecorder && mediaRecorder.state === "inactive") {
        mediaRecorder.start(10);
        const source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);
        if (onStartCallback) {
          onStartCallback();
        }
      }
    } else {
      if (navigator.mediaDevices) {
        console.log("getUserMedia supported.");

        navigator.mediaDevices
          .getUserMedia(constraints)
          .then(str => {
            stream = str;

            if (MediaRecorder.isTypeSupported(mediaOptions.mimeType)) {
              // mediaRecorder = new MediaRecorder(str, mediaOptions);
              mediaRecorder = new MediaStreamRecorder(str);
            } else {
              mediaRecorder = new MediaStreamRecorder(str);
            }
            mediaRecorder.mimeType = "audio/wav";

            if (onStartCallback) {
              onStartCallback();
            }

            // mediaRecorder.onstop = this.onStop;

            // mediaRecorder.onstop = function() {
            //   // recording has been stopped.
            //   console.log("stopppped");
            // };

            //onpause dont work with MediaStreamRecorder
            // mediaRecorder.onpause = () => {
            //   console.log(
            //     "mediaRecorder.onpause, mediaRecorder.state = " +
            //       mediaRecorder.state
            //   );
            //   onPauseCallback();
            // };

            mediaRecorder.onresume = function() {
              console.log(
                "mediaRecorder.onresume, mediaRecorder.state = " +
                  mediaRecorder.state
              );
            };

            mediaRecorder.onwarning = function(e) {
              console.log("mediaRecorder.onwarning: " + e);
            };

            // mediaRecorder.onpause = onPauseCallback;
            mediaRecorder.ondataavailable = blob => {
              let date = new Date();
              console.log(date.getTime(), "time diff 10000");
              chunks.push(blob);
              if (onDataCallback) {
                onDataCallback(blob);
              }
            };

            audioCtx = AudioContext.getAudioContext();
            audioCtx.resume().then(() => {
              analyser = AudioContext.getAnalyser();
              mediaRecorder.start(5000);
              const sourceNode = audioCtx.createMediaStreamSource(stream);
              sourceNode.connect(analyser);
            });
          })
          .catch(function(err) {
            /* handle the error */
            if (err.message == "Permission denied" && onBlockCallback) {
              onBlockCallback();
            }
          });
      } else {
        alert("Your browser does not support audio recording");
      }
    }
  };

  stopRecording() {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();

      stream.getAudioTracks().forEach(track => {
        track.stop();
      });
      mediaRecorder = null;
      AudioContext.resetAnalyser();

      // let blobURL;
      // ConcatenateBlobs(chunks, "audio/wav", function(resultingBlob) {
      //   console.log(resultingBlob, "res of concatenate blob");
      //   blobURL = window.URL.createObjectURL(resultingBlob);
      // });
      // chunks = [];

      // if (onStopCallback) {
      //   onStopCallback(blobURL);
      // }
      // if (onSaveCallback) {
      //   onSaveCallback(blobURL);
      // }
      this.onStop();
    }
  }

  pauseRecording() {
    if (mediaRecorder) {
      mediaRecorder.pause();
      onPauseCallback();
    }
  }

  resumeRecording() {
    if (mediaRecorder) {
      mediaRecorder.resume();
    }
  }

  onStop(error) {
    console.log("onStop called");
    // mediaRecorder.save();
    let blobURL;
    // const blob = new Blob(chunks, { type: mediaOptions.mimeType });
    window.ConcatenateBlobs(chunks, "audio/wav", function(resultingBlob) {
      console.log(resultingBlob, "res of concatenate blob");
      blobURL = window.URL.createObjectURL(resultingBlob);
      if (onStopCallback) {
        onStopCallback(blobURL);
      }
      if (onSaveCallback) {
        onSaveCallback(blobURL);
      }
      chunks = [];
    });
  }
}
