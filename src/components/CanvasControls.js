// cool blog article on how to do this: http://www.smartjava.org/content/exploring-html5-web-audio-visualizing-sound
// https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Visualizations_with_Web_Audio_API

// distortion curve for the waveshaper, thanks to Kevin Ennis
// http://stackoverflow.com/questions/22312841/waveshaper-node-in-webaudio-how-to-emulate-distortion

import React, { Component } from "react";
import { string, number, bool, func } from "prop-types";
import { MicrophoneRecorder } from "../libs/MicrophoneRecorder";
import AudioContext from "../libs/AudioContext";
import AudioPlayer from "../libs/AudioPlayer";
import Visualizer from "../libs/Visualizer";

export default class CanvasControls extends Component {
  constructor(props) {
    super(props);
    this.state = {
      microphoneRecorder: null,
      canvas: null,
      canvasCtx: null
    };
  }

  componentDidMount() {
    const {
      onSave,
      onStop,
      onStart,
      onData,
      onPause,
      onBlock,
      audioElem,
      audioBitsPerSecond,
      mimeType
    } = this.props;
    const { visualizer } = this.refs;
    const canvas = visualizer;
    const canvasCtx = canvas.getContext("2d");
    const options = {
      audioBitsPerSecond: audioBitsPerSecond,
      mimeType: mimeType
    };

    if (audioElem) {
      AudioPlayer.create(audioElem);

      this.setState(
        {
          canvas: canvas,
          canvasCtx: canvasCtx
        },
        () => {
          this.visualize();
        }
      );
    } else {
      this.setState(
        {
          microphoneRecorder: new MicrophoneRecorder(
            onStart,
            onStop,
            onPause,
            onSave,
            onData,
            onBlock,
            options
          ),
          canvas: canvas,
          canvasCtx: canvasCtx
        },
        () => {
          this.visualize();
        }
      );
    }
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (prevProps.isPaused == false) {
      if (this.state.microphoneRecorder) {
        if (this.props.isPaused == true) {
          console.log(this.state, "now pause called");

          this.state.microphoneRecorder.pauseRecording();
        }
      }
    }

    if (prevProps.isPaused == true) {
      if (this.state.microphoneRecorder) {
        if (this.props.isPaused == false) {
          console.log(this.state, "now xx resume called");

          this.state.microphoneRecorder.resumeRecording();
        }
      }
    }
  };

  visualize = () => {
    const self = this;
    const {
      backgroundColor,
      strokeColor,
      width,
      height,
      visualSetting
    } = this.props;
    const { canvas, canvasCtx } = this.state;

    if (visualSetting === "sinewave") {
      Visualizer.visualizeSineWave(
        canvasCtx,
        canvas,
        width,
        height,
        backgroundColor,
        strokeColor
      );
    } else if (visualSetting === "frequencyBars") {
      Visualizer.visualizeFrequencyBars(
        canvasCtx,
        canvas,
        width,
        height,
        backgroundColor,
        strokeColor
      );
    } else if (visualSetting === "frequencyCircles") {
      Visualizer.visualizeFrequencyCircles(
        canvasCtx,
        canvas,
        width,
        height,
        backgroundColor,
        strokeColor
      );
    }
  };

  clear() {
    const { width, height } = this.props;
    const { canvasCtx } = this.state;
    canvasCtx.clearRect(0, 0, width, height);
  }

  render() {
    const {
      isRecording,
      isPaused,
      onStop,
      width,
      height,
      onPause,
      startRecording,
      recorder_state
    } = this.props;
    const { microphoneRecorder, canvasCtx } = this.state;

    if (isRecording) {
      if (microphoneRecorder && recorder_state !== "active" ) {
        microphoneRecorder.startRecording(startRecording);
      }
    } else {
      if (microphoneRecorder) {
        microphoneRecorder.stopRecording();
        this.clear();
      }
    }

    return (
      <canvas
        className="waveform-canvas"
        ref="visualizer"
        height={height}
        width={width}
        className={this.props.className}
      ></canvas>
    );
  }
}

CanvasControls.propTypes = {
  backgroundColor: string,
  strokeColor: string,
  className: string,
  audioBitsPerSecond: number,
  mimeType: string,
  height: number,
  isRecording: bool.isRequired,
  onStop: func,
  onData: func,
  isPaused: bool.isRequired
};

CanvasControls.defaultProps = {
  backgroundColor: "#1a2e79",
  strokeColor: "#07cf89",
  className: "waveform_canvas",
  audioBitsPerSecond: 128000,
  // mimeType: "audio/webm;codecs=opus",
  mimeType: "audio/wav",
  isRecording: false,
  width: 640,
  height: 100,
  visualSetting: "sinewave",
  isPaused: false
};
