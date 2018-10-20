import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Webcam from "react-webcam";
import {isMobile} from 'react-device-detect';

class App extends Component {
  constructor(props) {
    super(props);
    this.webcam = null;
    this.state = {
      imageSrc: '',
      error: ''
    };

    this.onCapture = this.onCapture.bind(this);
  }

  onCapture = () => {
    const imageSrc = this.webcam.getScreenshot();
    console.log('captured: ', imageSrc);
    this.setState({
      imageSrc
    });
  }

  reportError(t) {
    console.error(t);
    this.setState({
      error: t
    });
  }

  render() {
    const videoConstraints = {
      width: 1280,
      height: 720,
      facingMode: isMobile ? { exact: "environment" } : "user"
    };
    console.log('imageSrc: ', this.state.imageSrc);

    return (
      <div className="App">
        <header className="App-header">
          <a
            className="App-link"
            rel="noopener noreferrer"
          >
          <button onClick={this.onCapture}>
          <img src={logo} className="App-logo" alt="logo" />
            Click Here to take an image
          </button>
          </a>
        </header>
        <div>
          {this.state.imageSrc ? 
            <img src={this.state.imageSrc} /> :
            null
          }
        </div>
        <div>
          Error Reporting: {this.state.error.message}
        </div>
        <div>
          <Webcam
            audio={false}
            height={350}
            ref={(ref) => { this.webcam = ref; }}
            screenshotFormat="image/jpeg"
            width={350}
            onUserMediaError={(t) => this.reportError(t)}
            videoConstraints={videoConstraints}
          />
        </div>
      </div>
    );
  }
}

export default App;
