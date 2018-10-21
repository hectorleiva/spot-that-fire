import React, { Component } from 'react';
import validator from 'validator';

const initialState = {
  isAuthorized: false,
  emailInputVal: '',
  passwordInputVal: '',
  error: '',
  success: ''
};

export default class Register extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;

    this.onBlurCapture = this.onBlurCapture.bind(this);
    this.onRegister = this.onRegister.bind(this);
    this.isValidLogin = this.isValidLogin.bind(this);
  }

  onBlurCapture(event) {
    const fieldName = event.target.name;
    const fieldValue = event.target.value;

    this.setState({
      [`${fieldName}Val`]: fieldValue
    });
  }

  async onRegister(event) {
    event.preventDefault();

    const {
      emailInputVal: email,
      passwordInputVal: password
    } = this.state;

    if (this.isValidLogin({ email, password })) {
      try {
        this.props.client.register({ email, password });
      } catch (error) {
        this.setState({
          error: error.message
        });
      }

      try {
        const response = await this.props.client.login({ email, password });
        this.props.cookieManager.setCookie(response.data.id, response.data.ttl);
        return;
      } catch (error) {
        this.setState({
          error: error.message
        });
      }
    }

    this.setState({
      error: 'Invalid options for registration'
    });
  }

  isValidLogin({ email, password }) {
    let errorMessage = '';
    const validationRules = {
      min: 5,
      max: 30
    };

    const checkEmail = email || '';
    const checkPassword = password || '';

    if (validator.isEmail(checkEmail) && validator.isLength(checkPassword, validationRules)) {
      return true;
    }

    if (!validator.isEmail(checkEmail)) {
      errorMessage += 'Invalid email passed.';
    }

    if (!validator.isLength(checkPassword, validationRules)) {
      errorMessage += 'Password needs to be between 5 and 30 characters.';
    }

    this.setState({
      error: errorMessage
    });

    return false;
  }

  render() {
    const isAuthenticated = this.props.isAuthenticated;
    console.log('isAuthenticated: ', isAuthenticated);

    return (
      <div>
        {isAuthenticated ?
          <div>Thanks for registering!</div> :
          <div>
            <div>
              {this.state.success &&
                <div>{this.state.sucess}</div>
              }
            </div>
            <div>
              {this.state.error &&
                <div>{this.state.error}</div>
              }
            </div>
            <form onSubmit={this.onRegister}>
              <label>
                Email Address
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
                Enter Password:
                <input
                  type="password"
                  id="password"
                  name="passwordInput"
                  placeholder=""
                  defaultValue={this.state.passwordInputVal}
                  onBlur={this.onBlurCapture}
                />
              </label>
              <input type="submit" value="Submit" />
            </form>
          </div>
        }
      </div>
    )
  }
}