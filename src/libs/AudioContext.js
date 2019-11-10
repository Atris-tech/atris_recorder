const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
console.log(audioCtx, "audioCtx");
let analyser = audioCtx.createAnalyser();

const AudioContext = {
  getAudioContext() {
    return audioCtx;
  },

  getAnalyser() {
    return analyser;
  },

  resetAnalyser() {
    analyser = audioCtx.createAnalyser();
  },

  decodeAudioData(audioData) {
    return audioCtx.decodeAudioData(audioData);

    // above fxn return a promise with can be used as below eg.
    // audioCtx.decodeAudioData(audioData).then(function(buffer) {
    //   // use the decoded data here
    // });
  }
};

export default AudioContext;
