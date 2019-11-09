import React, { Component } from "react";
import { render } from "react-dom";
import { FloatingActionButton, MuiThemeProvider } from "material-ui";
import MicrophoneOn from "material-ui/svg-icons/av/mic";
import MicrophoneOff from "material-ui/svg-icons/av/stop";
import PauseIcon from "material-ui/svg-icons/av/pause";

import { ReactMic } from "../../src";
import sampleAudio from "./sample_audio.webm";
import ReactGA from "react-ga";

require("./styles.scss");

ReactGA.initialize("UA-98862819-1");

export default class Demo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      blobURL: null,
      isRecording: false,
      isPaused: false,
      ws: null
    };
  }

  componentDidMount() {
    ReactGA.pageview(window.location.pathname);
    // this.connect();
  }

  timeout = 250; // Initial timeout duration as a class variable

  /**
   * @function connect
   * This function establishes the connect with the websocket and also ensures constant reconnection if connection closes
   */
  connect = () => {
    var ws = new WebSocket("ws://127.0.0.1:8000/ws/");
    let that = this; // cache the this
    var connectInterval;

    // websocket onopen event listener
    ws.onopen = () => {
      console.log("connected websocket main component");

      this.setState({ ws: ws });

      that.timeout = 250; // reset timer to 250 on open of websocket connection
      clearTimeout(connectInterval); // clear Interval on on open of websocket connection
    };

    // websocket onclose event listener
    ws.onclose = e => {
      console.log(
        `Socket is closed. Reconnect will be attempted in ${Math.min(
          10000 / 1000,
          (that.timeout + that.timeout) / 1000
        )} second.`,
        e.reason
      );

      that.timeout = that.timeout + that.timeout; //increment retry interval
      connectInterval = setTimeout(this.check, Math.min(10000, that.timeout)); //call check function after timeout
    };

    // websocket onerror event listener
    ws.onerror = err => {
      console.error(
        "Socket encountered error: ",
        err.message,
        "Closing socket"
      );

      ws.close();
    };
  };

  /**
   * utilited by the @function connect to check if the connection is close, if so attempts to reconnect
   */
  check = () => {
    const { ws } = this.state;
    if (!ws || ws.readyState == WebSocket.CLOSED) this.connect(); //check if websocket instance is closed, if so call `connect` function.
  };

  sendMessage = data => {
    const { ws } = this.state; // websocket instance passed as props to the child component.

    try {
      ws.send(data); //send data to the server
    } catch (error) {
      console.log(error); // catch error
    }
  };

  startOrPauseRecording = () => {
    const { isPaused, isRecording } = this.state;

    if (isRecording) {
      this.setState({ isPaused: true });
    }
    if (isRecording && isPaused) {
      this.setState({ isPaused: false });
    }
    if (!(isRecording && isPaused)) {
      this.setState({ isRecording: true });
    }
  };

  stopRecording = () => {
    this.setState({ isRecording: false });
  };

  onSave = blobObject => {};

  onStart = () => {
    console.log("You can tap into the onStart callback");
  };

  onStop = blobURL => {
    this.setState({ blobURL: blobURL });
    console.log(blobURL);
  };

  onData = recordedBlob => {
    console.log("ONDATA CALL IS BEING CALLED! ", recordedBlob);
    // this.sendMessage(recordedBlob);
  };

  onBlock = () => {
    alert("ya blocked me!");
    this.setState({ isRecording: false });
  };

  onPause = () => {
    console.log("main onPause");
  };

  render() {
    const { blobURL, isRecording, isPaused } = this.state;

    return (
   <ReactMic
   />
   );
  }
}

render(<Demo />, document.querySelector("#demo"));
