import AudioContext from "./AudioContext";

let drawVisual;

const Visualizer = {
  playerSineWave(
    canvasCtx,
    canvas,
    width,
    height,
    backgroundColor,
    strokeColor,
    buffer,
    audioEndCallBack,
    setAudioBufferSourceNode,
    playTime // have value null when being played for first time, else containg playing offset
  ) {
    console.log("playerSineWave in ");

    const BaseAudioContext = AudioContext.getAudioContext();
    var audioBufferSouceNode = BaseAudioContext.createBufferSource();

    setAudioBufferSourceNode(audioBufferSouceNode);

    let analyser = AudioContext.getAnalyser();

    //connect the source to the analyser
    audioBufferSouceNode.connect(analyser);
    //connect the analyser to the destination(the speaker), or we won't hear the sound
    analyser.connect(BaseAudioContext.destination);
    //then assign the buffer to the buffer source node
    audioBufferSouceNode.buffer = buffer;

    audioBufferSouceNode.start(0, playTime); //play the audio

    audioBufferSouceNode.onended = audioEndCallBack;

    const bufferLength = analyser.fftSize;
    const dataArray = new Uint8Array(bufferLength);

    canvasCtx.clearRect(0, 0, width, height);

    function draw() {
      drawVisual = requestAnimationFrame(draw);

      analyser = AudioContext.getAnalyser();

      analyser.getByteTimeDomainData(dataArray);

      // canvasCtx.fillStyle = backgroundColor;
      // canvasCtx.fillRect(0, 0, width, height);

      // Create gradient
      let grd = canvasCtx.createRadialGradient(
        135.0,
        135.0,
        0.0,
        135.0,
        135.0,
        150.0
      );

      // Add colors
      grd.addColorStop(0.0, "rgba(32, 44, 100, 1.000)");
      grd.addColorStop(0.471, "rgba(26, 44, 127, 1.000)");
      grd.addColorStop(1.0, "rgba(32, 44, 100, 1.000)");

      // Fill with gradient
      canvasCtx.fillStyle = grd;
      canvasCtx.fillRect(0, 0, width, height);

      // canvasCtx.fill();

      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = strokeColor;

      canvasCtx.beginPath();

      const sliceWidth = (width * 1.0) / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * height) / 2;

        if (i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      canvasCtx.lineTo(canvas.width, canvas.height / 2);
      canvasCtx.stroke();
    }

    draw();
  },
  visualizeSineWave(
    canvasCtx,
    canvas,
    width,
    height,
    backgroundColor,
    strokeColor
  ) {
    let analyser = AudioContext.getAnalyser();

    const bufferLength = analyser.fftSize;
    const dataArray = new Uint8Array(bufferLength);

    canvasCtx.clearRect(0, 0, width, height);

    function draw() {
      drawVisual = requestAnimationFrame(draw);

      analyser = AudioContext.getAnalyser();

      analyser.getByteTimeDomainData(dataArray);

      // canvasCtx.fillStyle = backgroundColor;
      // canvasCtx.fillRect(0, 0, width, height);

      // Create gradient
      let grd = canvasCtx.createRadialGradient(
        135.0,
        135.0,
        0.0,
        135.0,
        135.0,
        150.0
      );

      // Add colors
      grd.addColorStop(0.0, "rgba(32, 44, 100, 1.000)");
      grd.addColorStop(0.471, "rgba(26, 44, 127, 1.000)");
      grd.addColorStop(1.0, "rgba(32, 44, 100, 1.000)");

      // Fill with gradient
      canvasCtx.fillStyle = grd;
      canvasCtx.fillRect(0, 0, width, height);

      // canvasCtx.fill();

      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = strokeColor;

      canvasCtx.beginPath();

      const sliceWidth = (width * 1.0) / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * height) / 2;

        if (i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      canvasCtx.lineTo(canvas.width, canvas.height / 2);
      canvasCtx.stroke();
    }

    draw();
  },

  visualizeFrequencyBars(
    canvasCtx,
    canvas,
    width,
    height,
    backgroundColor,
    strokeColor
  ) {
    const self = this;
    let analyser = AudioContext.getAnalyser();
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    canvasCtx.clearRect(0, 0, width, height);

    function draw() {
      drawVisual = requestAnimationFrame(draw);

      analyser = AudioContext.getAnalyser();
      analyser.getByteFrequencyData(dataArray);

      canvasCtx.fillStyle = backgroundColor;
      canvasCtx.fillRect(0, 0, width, height);

      const barWidth = (width / bufferLength) * 2.5;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i];

        const rgb = self.hexToRgb(strokeColor);

        // canvasCtx.fillStyle = `rgb(${barHeight+100},${rgb.g},${rgb.b})`;
        canvasCtx.fillStyle = strokeColor;
        canvasCtx.fillRect(x, height - barHeight / 2, barWidth, barHeight / 2);

        x += barWidth + 1;
      }
    }

    draw();
  },

  visualizeFrequencyCircles(
    canvasCtx,
    canvas,
    width,
    height,
    backgroundColor,
    strokeColor
  ) {
    const self = this;
    let analyser = AudioContext.getAnalyser();
    analyser.fftSize = 32;
    const bufferLength = analyser.frequencyBinCount;

    const dataArray = new Uint8Array(bufferLength);
    canvasCtx.clearRect(0, 0, width, height);

    function draw() {
      drawVisual = requestAnimationFrame(draw);
      analyser = AudioContext.getAnalyser();
      analyser.getByteFrequencyData(dataArray);
      const reductionAmount = 3;
      const reducedDataArray = new Uint8Array(bufferLength / reductionAmount);

      for (let i = 0; i < bufferLength; i += reductionAmount) {
        let sum = 0;
        for (let j = 0; j < reductionAmount; j++) {
          sum += dataArray[i + j];
        }
        reducedDataArray[i / reductionAmount] = sum / reductionAmount;
      }

      canvasCtx.clearRect(0, 0, width, height);
      canvasCtx.beginPath();
      canvasCtx.arc(
        width / 2,
        height / 2,
        Math.min(height, width) / 2,
        0,
        2 * Math.PI
      );
      canvasCtx.fillStyle = backgroundColor;
      canvasCtx.fill();
      const stepSize = Math.min(height, width) / 2.0 / reducedDataArray.length;
      canvasCtx.strokeStyle = strokeColor;

      for (let i = 0; i < reducedDataArray.length; i++) {
        canvasCtx.beginPath();
        const normalized = reducedDataArray[i] / 128;
        const r = stepSize * i + stepSize * normalized;
        canvasCtx.arc(width / 2, height / 2, r, 0, 2 * Math.PI);
        canvasCtx.stroke();
      }
    }
    draw();
  },

  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        }
      : null;
  }
};

export default Visualizer;
