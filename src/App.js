import React, { Component } from 'react';
import Webcam from "react-webcam";
import { isMobile } from 'react-device-detect';
import axios from 'axios';
import Geolocation from 'react-geolocation';

import logo from './logo.svg';

import './App.css';

const initialState = {
  imageSrc: '',
  error: '',
  uploadStatus: '',
  usersGeolocation: {
    latitude: '',
    longitude: '',
    altitude: '',
    geolocationAccuracy: '',
    geolocationTimestamp: '',
    altitudeAccuracy: '',
    heading: ''
  },
  note: ''
};

class App extends Component {
  constructor(props) {
    super(props);
    this.webcam = null;
    this.state = initialState;

    this.baseUrl = 'http://localhost:3001';
    this.uploadUrl = '/api/incidents';

    this.onCapture = this.onCapture.bind(this);
    this.uploadProgressIndicator = this.uploadProgressIndicator.bind(this);
    this.onCapturingUserLocation = this.onCapturingUserLocation.bind(this);
    this.onBlurWritingNote = this.onBlurWritingNote.bind(this);

    this.axios = axios.create({
      baseURL: this.baseUrl,
      timeout: 10000,
      onUploadProgress: this.uploadProgressIndicator
    });
  }

  onCapture() {
    const imageSrc = this.webcam.getScreenshot();

    this.setState({
      imageSrc
    });

    this.uploadMedia(imageSrc);
  }

  onCapturingUserLocation(position) {
    const {
      coords: {
        latitude,
        longitude,
        altitude,
        accuracy,
        altitudeAccuracy,
        heading,
        speed
      },
      timestamp
    } = position;

    this.setState({
      usersGeolocation: {
        latitude,
        longitude,
        altitude,
        geolocationAccuracy: accuracy,
        geolocationTimestamp: timestamp,
        altitudeAccuracy,
        heading,
        speed
      }
    });
  }

  onBlurWritingNote(event) {
    console.log('text?: ', event.target.value);
    this.setState({
      note: event.target.value
    });
  }

  async uploadMedia(imageData) {
    const {
      usersGeolocation: {
        latitude,
        longitude,
        altitude,
        geolocationAccuracy,
        geolocationTimestamp,
        altitudeAccuracy,
        heading,
        speed
      },
      note
    } = this.state;

    const payload = {
      geolocation: {
        lat: latitude,
        lng: longitude
      },
      geolocationAccuracy,
      geolocationTimestamp,
      altitude,
      altitudeAccuracy,
      heading,
      speed,
      type: 'image',
      media: imageData,
      format: 'jpg',
      note
    };

    try {
      const response = await this.axios.post(this.uploadUrl, payload);
      console.log('response: ', response);

      // Reset state
      this.setState(initialState);
    } catch (error) {
      this.setState({
        uploadStatus: 'Unable to upload, please try again'
      });
    }
  }

  uploadProgressIndicator(progressEvent) {
    const uploadStatus = this.calculateUploadStatus({
      total: progressEvent.total,
      loaded: progressEvent.loaded
    });

    this.setState({
      uploadStatus
    });
  }

  calculateUploadStatus({ total, loaded }) {
    if (total === loaded) {
      return 'Upload complete';
    }

    const loadPercentage = Math.floor((loaded / total) * 100);
    return `Upload is ${loadPercentage}% complete`;
  }

  reportError(t) {
    console.error(t);
    this.setState({
      error: t
    });
  }

  get videoConstraints() {
    return {
      width: 1280,
      height: 720,
      facingMode: isMobile ? { exact: "environment" } : "user"
    };
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <button onClick={this.onCapture}>
          <img src={logo} className="App-logo" alt="Logo" />
            Click here to take an image and upload to the server
          </button>
        </header>
        <Geolocation
          onSuccess={this.onCapturingUserLocation}
          render={({
            error
          }) =>
            <div>
              {error &&
                <div>
                  {error.message}
                </div>
              }
            </div>
          }
        />
        <div>
          {this.state.uploadStatus ?
            'UploadStatus: ' + this.state.uploadStatus :
            null
          }
        </div>
        <div>
          {this.state.imageSrc ? 
            <img src={this.state.imageSrc} alt="Current Capture" /> :
            null
          }
        </div>
        <div>
        {this.state.error.message ? 
          'There was an error: ' + this.state.error.message
          : null
        }
        </div>
        <div>
          <Webcam
            audio={false}
            height={350}
            ref={(ref) => { this.webcam = ref; }}
            screenshotFormat="image/jpeg"
            width={350}
            onUserMediaError={(t) => this.reportError(t)}
            videoConstraints={this.videoConstraints}
          />
        </div>
        <textarea
          id="note"
          onBlur={this.onBlurWritingNote}
          defaultValue={this.state.note}
         >
        </textarea>
      </div>
    );
  }
}

export default App;
