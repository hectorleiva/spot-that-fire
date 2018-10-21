import React, { Component } from 'react';
import validator from 'validator';

const initialState = {
  postalCodeInputVal: '',
  emailInputVal: '',
  error: '',
  uploadStatus: '',
  authorizationCookie: ''
};

class IncidentSubscription extends Component {
  constructor(props) {
    super(props);

    this.state = initialState;

    this.submitSubscription = this.submitSubscription.bind(this);
    this.onBlurCapture = this.onBlurCapture.bind(this);
    this.validatePayload = this.validatePayload.bind(this);
    this.uploadProgressIndicator = this.uploadProgressIndicator.bind(this);
  }

  async submitSubscription(event) {
    event.preventDefault();

    const {
      postalCodeInputVal: postalCode,
      emailInputVal: email
    } = this.state;

    if (this.validatePayload({ postalCode, email })) {
      try {
        const response = await this.props.client.submitSubscription({
          email,
          postalCode
        });

        if (response.status !== 200) {
          throw new Error('Unable to submit your email/postal code. Please try again.');
        }
        this.setState(initialState);
        return;
      } catch (error) {
        this.setState({
          error: error.message
        });
        return;
      }
    }

    this.setState({
      error: 'Invalid inputs, please try again.'
    })
  }

  validatePayload({ postalCode, email }) {
    if (validator.isEmail(email) && validator.isPostalCode(postalCode, 'any')) {
      return true;
    }
    return false;
  }

  onBlurCapture(event) {
    const fieldName = event.target.name;
    const fieldValue = event.target.value;

    this.setState({
      [`${fieldName}Val`]: fieldValue
    });
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

  isAuthorized(props) {
    const { cookies } = props;

    if (cookies.get('STFCookie')) {
      return true;
    }
    return false;
  }

  render() {
    return (
      <div>
        <div>
          {this.state.error &&
            <div>
              {this.state.error}
            </div>
          }
        </div>
        <div>
          {this.uploadStatus &&
            <div>{this.uploadStatus}</div>
          }
        </div>
        <form onSubmit={this.submitSubscription}>
          <label>
            Email to subscribe to incidents:
            <input
              type="email"
              name="emailInput"
              defaultValue={this.state.emailInputVal}
              onBlur={this.onBlurCapture}
            >
            </input>
          </label>
          <br />
          <label>
            Enter Zipcode of area you wish to be informed for any future fire incident:
            <input
              type="text"
              id="postalCode"
              name="postalCodeInput"
              placeholder="15203 for example"
              defaultValue={this.state.postalCodeInputVal}
              onBlur={this.onBlurCapture}
            />
          </label>
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}

export default IncidentSubscription;