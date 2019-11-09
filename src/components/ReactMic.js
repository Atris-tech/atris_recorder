import React, { Component } from "react";
import "./ReactMic.css";
import mic_not_allow from "../assets/mic-not-allow.svg";
import cross_icon from "../assets/cross-icon.svg";
import record_icon from "../assets/record.svg";
import pause from "../assets/pause.svg";
import settings from "../assets/settings.svg";
import CanvasControls from "./CanvasControls";

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
    dialog_settings: false
  };

  render() {
    return (
      <div class="root_padding">
        <div class="vr-voice-recorder-container">
          {
            //allow-mic wait-record reset [active (active paused) add class below] processing preview
          }
          <div class={`voice-recorder ${this.state.recorder_state}`}>
            <div class="allow-mic-message ">
              <div class="mic-icon">
                <img src={mic_not_allow} alt="mic-not-allow-icon" />
              </div>
              <div>Please allow access to your microphone to continue…</div>
            </div>
            <div class="reaching-max-time-msg">
              <div class="msg">
                {" "}
                You are reaching maximum record time. Recording will be stopped
                in
                <span class="time"></span>
              </div>
            </div>
            <div class="press-mic-message">
              <div>Click the button to start recording…</div>
            </div>
            <div class="waveform-container">
              <div class="audio-editor">
                <div class="top-controls">
                  <button class="btn-quit">
                    <img src={cross_icon} alt="quit-icon" />
                  </button>
                </div>
                <div class="canvas-and-controls">
                  <div class="waveform-canvas-container">
                    <div class="selection-area"></div>
                    <div class="canvas-wrapper">
                      <CanvasControls
                        className="waveform_canvas"
                        width={1366}
                        height={120}
                      />
                    </div>
                    <div class="play-progress-line"></div>
                  </div>
                  <div class="control-bars-wrapper">
                    <div class="record-controls">
                      <div class="control-bar cb-left"></div>
                      <div class="control-bar cb-right"></div>
                    </div>
                  </div>
                </div>
                <div class="controls flex">
                  <div class="flex-1">
                    <button class="play-button">
                      <div class="tooltip">
                        <span>Play</span>
                        <span class="space">Space</span>
                      </div>
                      <div class="arrow"></div>
                    </button>
                    <button class="fade-in"></button>
                    <button class="fade-out"></button>
                  </div>
                  <div class="block-save flex">
                    <div class="flex-right">
                      <button class="btn-save">
                        <div class="save-label">Save</div>
                        <div class="save-processing">
                          <div class="save-processing-bg"></div>
                          <div class="save-processing-label">Processing...</div>
                        </div>
                      </button>
                      <div class="dropdown">
                        <button class="btn-save-gdrive">Google Drive</button>
                        <button class="btn-save-dropbox">Dropbox</button>
                      </div>
                    </div>
                  </div>
                </div>
                {
                  //visible below to show it
                }
                <div class="dialog-quit">
                  <div class="label-quit">
                    Are you sure you want to finish editing?
                  </div>
                  <button class="btn-quit-accept">Yes</button>
                  <button class="btn-quit-deny">Cancel</button>
                </div>
              </div>
            </div>
            <div class="bottom-menu">
              <div class="mode-switch flex-1 flex-left"></div>
              <div class="flex-1 flex-center">
                {
                  //active class below
                }
                <div
                  class={`btn-record ${(this.state.recorder_state ==
                    recorderStates.active ||
                    this.state.recorder_state ==
                      recorderStates.active_paused) &&
                    "active"}`}
                    
                  onClick={() => {
                    if (
                      this.state.recorder_state ===
                        recorderStates.active_paused ||
                      this.state.recorder_state === recorderStates.active
                    ) {
                      //means recording stoped, can also do redirect callbacks here
                      this.setState({
                        recorder_state: recorderStates.processing
                      });
                    } else if (
                      this.state.recorder_state === recorderStates.wait_record
                    ) {
                      this.setState({
                        recorder_state: recorderStates.active
                      });
                    }
                  }}
                >
                  <div class="icn-record">
                    <i class="icn-record-inner"></i>
                    <img src={record_icon} alt="record_icon" />
                  </div>
                  <div class="record-timer"> 00:00 </div>
                  <div class="processing-info">
                    <div class="processing-info-inner"></div>
                    <div class="processing-text">
                      <span class="the-text">Processing...</span>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  class="btn-pause-record"
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
                  <i class="icn-pause-record">
                    <img src={pause} alt="pause_icon" />
                  </i>
                </button>
              </div>
              <div class="flex-1 flex-right">
                <div class="settings">
                  <button
                    type="button"
                    class="btn-settings"
                    onClick={() => {
                      this.setState(prevState => ({
                        dialog_settings: !prevState.dialog_settings
                      }));
                    }}
                  >
                    <img src={settings} alt="settings" />
                  </button>
                  <div
                    class={`dialog-settings ${!this.state.dialog_settings &&
                      "hidden"}`}
                  >
                    <div class="settings-group mic-enable active">
                      <div class="settings-header wrapper">
                        <span>Microphone</span>
                      </div>
                      <div class="settings-mics visible">
                        <ul class="select-mic">
                          <li
                            data-device-id="default"
                            data-device-label="Default"
                            class="mic-item active"
                          >
                            <i class="a-indicator"></i>
                            <span>Default</span>
                          </li>
                          <li
                            data-device-id="a1608f2b21bf2c55b5583882607c9e1d7d5b0cac5e7a0737217c097730dd2d09"
                            data-device-label="Built-in Audio Analog Stereo"
                            class="mic-item"
                          >
                            <i class="a-indicator"></i>
                            <span>Built-in Audio Analog Stereo</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="alert error browser-not-supported">
              <div class="alert_icon"></div>
              <div class="h">Your browser is not supported</div>
              <div class="desc">
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
            <div class="alert error common" id="alert-template">
              <div class="alert_icon"></div>
              <div class="desc only hidden no-mics">
                No microphones found. Sound recording is unavailable.
              </div>
              <div class="desc only hidden internal-error"></div>
              <div class="buttons">
                <button class="btn white btn-alert-ok">Ok</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
