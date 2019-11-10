import React, { Component } from "react";
import { blobToArrayBuffer } from "blob-util";
import "./ReactMic.css";
import mic_not_allow from "../assets/mic-not-allow.svg";
import cross_icon from "../assets/cross-icon.svg";
import record_icon from "../assets/record.svg";
import pause from "../assets/pause.svg";
import settings from "../assets/settings.svg";
import CanvasControls from "./CanvasControls";
import AudioContext from "../libs/AudioContext";
import Visualizer from "../libs/Visualizer";

let recorderStates = {
  allow_mic: "allow_mic",
  wait_record: "wait-record",
  active: "active",
  active_paused: "active paused",
  processing: "processing",
  preview: "preview"
};
export default class ReactMic extends Component {
  state = {
    recorder_state: recorderStates.wait_record,
    dialog_settings: false,
    start_request: false,
    isRecording: false,
    isPaused: false,
    blobURL: null
  };

  startRecording = () => {
    this.setState({
      recorder_state: recorderStates.active
    });
  };

  stopRecording = () => {
    this.setState({ isRecording: false });
  };

  onSave = blobObject => {};

  onStart = () => {
    console.log("You can tap into the onStart callback");
  };

  setRef = childRef => {
    this.canvasRef = childRef;
  };

  onStop = blobObject => {
    // let blobURL = window.URL.createObjectURL(blobObject);

    // this.setState({ blobURL: blobURL });
    /* Use the await keyword to wait for the Promise to resolve */
    // console.log(blobObject, "before array buff");

    blobToArrayBuffer(blobObject)
      .then(function(arrayBuff) {
        console.log(arrayBuff, "xxx xx ");
        const test1 = arrayBuff => {
          console.log("test fxn called", arrayBuff);

          const canvas = this.canvasRef;
          const canvasCtx = canvas.getContext("2d");
          let width = 1366;
          let height = 120;
          let backgroundColor = "";
          let strokeColor = "#07cf89";
          const test1 = arrayBuff => {
            console.log("test fxn called", arrayBuff);
          };
          test1(arrayBuff);
          AudioContext.decodeAudioData(arrayBuff)
            .then(buffer => {
              Visualizer.playerSineWave(
                canvasCtx,
                canvas,
                width,
                height,
                backgroundColor,
                strokeColor,
                buffer
              );
              const test = buffer => {
                console.log("test fxn called", buffer);
              };
              test(buffer);
            })
            .catch(err => {
              console.log(err, " at audio decode and viz");
            });
        };
        test1(arrayBuff);
      })
      .catch(function(err) {
        // error
      });
  };

  onData = recordedBlob => {
    console.log("ONDATA CALL IS BEING CALLED! ", recordedBlob);
    // this.sendMessage(recordedBlob);
  };

  onBlock = () => {
    // alert("ya blocked me!");
    this.setState({
      isRecording: false,
      recorder_state: recorderStates.allow_mic
    });
  };

  onPause = () => {
    console.log("main onPause");
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (prevState.recorder_state !== this.state.recorder_state) {
      if (
        prevState.recorder_state === recorderStates.wait_record &&
        this.state.recorder_state === recorderStates.active
        //state wait record to acitve
      ) {
        this.setState({
          isRecording: true,
          isPaused: false
        });
      }

      if (
        prevState.recorder_state === recorderStates.active_paused &&
        this.state.recorder_state === recorderStates.active
        //state active paused to acitve
      ) {
        this.setState({
          isRecording: true,
          isPaused: false
        });
      }

      if (this.state.recorder_state === recorderStates.active_paused) {
        this.setState({
          isRecording: true,
          isPaused: true
        });
      }
      if (this.state.recorder_state === recorderStates.processing) {
        this.setState({
          isRecording: false,
          isPaused: false
        });
      }
    }
  };

  render() {
    const { blobURL, isRecording, isPaused } = this.state;

    return (
      <div className="root_padding">
        <div className="vr-voice-recorder-container">
          {
            //allow-mic wait-record reset [active (active paused) add class below] processing preview
          }
          <div className={`voice-recorder ${this.state.recorder_state}`}>
            <div className="allow-mic-message ">
              <div className="mic-icon">
                <img src={mic_not_allow} alt="mic-not-allow-icon" />
              </div>
              <div>Please allow access to your microphone to continue…</div>
            </div>
            <div className="reaching-max-time-msg">
              <div className="msg">
                {" "}
                You are reaching maximum record time. Recording will be stopped
                in
                <span className="time"></span>
              </div>
            </div>
            <div className="press-mic-message">
              <div>Click the button to start recording…</div>
            </div>
            <div className="waveform-container">
              <div className="audio-editor">
                <div className="top-controls">
                  <button className="btn-quit">
                    <img src={cross_icon} alt="quit-icon" />
                  </button>
                </div>
                <div className="canvas-and-controls">
                  <div className="waveform-canvas-container">
                    <div className="selection-area"></div>
                    <div className="canvas-wrapper">
                      <CanvasControls
                        className="waveform_canvas"
                        width={1366}
                        height={120}
                        isRecording={isRecording}
                        isPaused={isPaused}
                        backgroundColor="#000"
                        visualSetting="sinewave"
                        audioBitsPerSecond={128000}
                        recorder_state={this.state.recorder_state}
                        startRecording={this.startRecording}
                        onStop={this.onStop}
                        onStart={this.onStart}
                        onSave={this.onSave}
                        onData={this.onData}
                        onBlock={this.onBlock}
                        onPause={this.onPause}
                        strokeColor="#07cf89"
                        setRef={this.setRef}
                      />
                    </div>
                    <div className="play-progress-line"></div>
                  </div>
                  <div className="control-bars-wrapper">
                    <div className="record-controls">
                      <div className="control-bar cb-left"></div>
                      <div className="control-bar cb-right"></div>
                    </div>
                  </div>
                </div>
                <div className="controls flex">
                  <div className="flex-1">
                    <button className="play-button">
                      <div className="tooltip">
                        <span>Play</span>
                        <span className="space">Space</span>
                      </div>
                      <div className="arrow"></div>
                    </button>
                    <button className="fade-in"></button>
                    <button className="fade-out"></button>
                  </div>
                  <div className="block-save flex">
                    <div className="flex-right">
                      <button className="btn-save">
                        <div className="save-label">Save</div>
                        <div className="save-processing">
                          <div className="save-processing-bg"></div>
                          <div className="save-processing-label">
                            Processing...
                          </div>
                        </div>
                      </button>
                      <div className="dropdown">
                        <button className="btn-save-gdrive">
                          Google Drive
                        </button>
                        <button className="btn-save-dropbox">Dropbox</button>
                      </div>
                    </div>
                  </div>
                </div>
                {
                  //visible below to show it
                }
                <div className="dialog-quit">
                  <div className="label-quit">
                    Are you sure you want to finish editing?
                  </div>
                  <button className="btn-quit-accept">Yes</button>
                  <button className="btn-quit-deny">Cancel</button>
                </div>
              </div>
            </div>
            <div className="bottom-menu">
              <div className="mode-switch flex-1 flex-left"></div>
              <div className="flex-1 flex-center">
                {
                  //active class below
                }
                <div
                  className={`btn-record ${(this.state.recorder_state ==
                    recorderStates.active ||
                    this.state.recorder_state ==
                      recorderStates.active_paused) &&
                    "active"}`}
                  onClick={() => {
                    if (
                      this.state.recorder_state ===
                        recorderStates.active_paused ||
                      this.state.recorder_state === recorderStates.active
                      //condition for recording active state
                    ) {
                      //means recording stoped, can also do redirect callbacks here
                      this.setState({
                        recorder_state: recorderStates.processing
                      });
                      //currently moving to preview after 1 sec
                      setTimeout(
                        function() {
                          this.setState({
                            recorder_state: recorderStates.preview
                          });
                        }.bind(this),
                        1000
                      );
                    } else if (
                      //condition for first time record state, we do allow mic and if it later allowrd we do active state by callback
                      // we set isRecording true to start microphone.reco fxn in canvasControls component
                      this.state.recorder_state === recorderStates.wait_record
                    ) {
                      this.setState({
                        recorder_state: recorderStates.allow_mic,
                        isRecording: true
                      });
                    }
                  }}
                >
                  <div className="icn-record">
                    <i className="icn-record-inner"></i>
                    <img src={record_icon} alt="record_icon" />
                  </div>
                  <div className="record-timer"> 00:00 </div>
                  <div className="processing-info">
                    <div className="processing-info-inner"></div>
                    <div className="processing-text">
                      <span className="the-text">Processing...</span>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn-pause-record"
                  onClick={() => {
                    if (
                      this.state.recorder_state === recorderStates.active_paused
                    ) {
                      this.setState({
                        recorder_state: recorderStates.active
                      });
                    } else {
                      this.setState({
                        recorder_state: recorderStates.active_paused
                      });
                    }
                  }}
                >
                  <i className="icn-pause-record">
                    <img src={pause} alt="pause_icon" />
                  </i>
                </button>
              </div>
              <div className="flex-1 flex-right">
                <div className="settings">
                  <button
                    type="button"
                    className="btn-settings"
                    onClick={() => {
                      this.setState(prevState => ({
                        dialog_settings: !prevState.dialog_settings
                      }));
                    }}
                  >
                    <img src={settings} alt="settings" />
                  </button>
                  <div
                    className={`dialog-settings ${!this.state.dialog_settings &&
                      "hidden"}`}
                  >
                    <div className="settings-group mic-enable active">
                      <div className="settings-header wrapper">
                        <span>Microphone</span>
                      </div>
                      <div className="settings-mics visible">
                        <ul className="select-mic">
                          <li
                            data-device-id="default"
                            data-device-label="Default"
                            className="mic-item active"
                          >
                            <i className="a-indicator"></i>
                            <span>Default</span>
                          </li>
                          <li
                            data-device-id="a1608f2b21bf2c55b5583882607c9e1d7d5b0cac5e7a0737217c097730dd2d09"
                            data-device-label="Built-in Audio Analog Stereo"
                            className="mic-item"
                          >
                            <i className="a-indicator"></i>
                            <span>Built-in Audio Analog Stereo</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="alert error browser-not-supported">
              <div className="alert_icon"></div>
              <div className="h">Your browser is not supported</div>
              <div className="desc">
                To use this website, we recommend the latest version of
                <a
                  href="https://www.google.com/chrome/browser/desktop/index.html"
                  target="_blank"
                  rel="nofollow"
                >
                  Chrome
                </a>{" "}
                or
                <a
                  href="https://www.mozilla.org/firefox/new/"
                  target="_blank"
                  rel="nofollow"
                >
                  Firefox
                </a>
                .
              </div>
            </div>
            <div className="alert error common" id="alert-template">
              <div className="alert_icon"></div>
              <div className="desc only hidden no-mics">
                No microphones found. Sound recording is unavailable.
              </div>
              <div className="desc only hidden internal-error"></div>
              <div className="buttons">
                <button className="btn white btn-alert-ok">Ok</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
