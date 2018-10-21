import React, { Component } from 'react';
import Webcam from "react-webcam";
import { isMobile } from 'react-device-detect';
import Geolocation from 'react-geolocation';

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

export default class CaptureIncident extends Component {
  constructor(props) {
    super(props);
    this.webcam = null;
    this.state = initialState;

    this.onCapture = this.onCapture.bind(this);
    this.uploadProgressIndicator = this.uploadProgressIndicator.bind(this);
    this.onCapturingUserLocation = this.onCapturingUserLocation.bind(this);
    this.onBlurWritingNote = this.onBlurWritingNote.bind(this);
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
      const response = await this.props.client.submitIncident(payload);
      console.log('response: ', response);

      // Reset state
      this.setState({
        ...initialState,
        uploadStatus: 'Upload complete'
      });
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
    return(
      <div>
        <button onClick={this.onCapture}>
          Click here to take an image of a fire and upload it.
        </button>
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
          ></textarea>
        </div>
      </div>
    );
  }
}