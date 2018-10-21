import React, { Component } from 'react';
import styled from 'styled-components';
import validator from 'validator';

const initialState = {
  postalCodeInputVal: '',
  emailInputVal: '',
  error: '',
  uploadStatus: '',
  authorizationCookie: ''
};

const HeaderSubscription = styled.div`
  display: block;
  font-size: 1.5em;
  color: black;
  padding: 1em 0em;
`;

const Label = styled.label`
  display: block;
  padding: 1em 2em;
  text-align: left;
`;

const InputField = styled.input`
  margin-left: 1em;
`;

const Submit = styled.input`
  padding: 1em 2em;
  font-size: 1em;
  color: white;
  background-color: red;
`;

class IncidentSubscription extends Component {
  constructor(props) {
    super(props);

    this.state = initialState;

    this.submitSubscription = this.submitSubscription.bind(this);
    this.onBlurCapture = this.onBlurCapture.bind(this);
    this.validatePayload = this.validatePayload.bind(this);
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
        }, this.props.cookieManager.getCookie());

        if (response.status !== 200) {
          throw new Error('Unable to submit your email/postal code. Please try again.');
        }

        this.setState({
          ...initialState,
          uploadStatus: 'Successfully submitted!'
        });
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

  render() {
    return (
      <div>
        <HeaderSubscription>
          Enter your email here and we can alert you of any near by
          wildfire incidents.
        </HeaderSubscription>
        <div>
          {this.state.uploadStatus ? 
            <div>{this.state.uploadStatus}</div> :
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
                <Label>
                  Email to subscribe to incidents:
                  <InputField
                    type="email"
                    name="emailInput"
                    defaultValue={this.state.emailInputVal}
                    onBlur={this.onBlurCapture}
                  />
                </Label>
                <br />
                <Label>
                  Enter Zipcode of area you wish to be informed for any future fire incident:
                  <InputField
                    type="number"
                    id="postalCode"
                    name="postalCodeInput"
                    placeholder="15203 for example"
                    defaultValue={this.state.postalCodeInputVal}
                    onBlur={this.onBlurCapture}
                  />
                </Label>
                <Submit type="submit" value="Submit" />
              </form>
            </div>
          }
        </div>
      </div>
    );
  }
}

export default IncidentSubscription;