import React, { Component } from 'react';
import validator from 'validator';
import { Link } from 'react-router-dom';

const initialState = {
  isAuthorized: false,
  emailInputVal: '',
  passwordInputVal: '',
  error: '',
  redirect: false
};

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = initialState;

    this.onLogin = this.onLogin.bind(this);
    this.onBlurCapture = this.onBlurCapture.bind(this);
    this.isValidLogin = this.isValidLogin.bind(this);
  }

  onBlurCapture(event) {
    const fieldName = event.target.name;
    const fieldValue = event.target.value;

    this.setState({
      [`${fieldName}Val`]: fieldValue
    });
  }

  async onLogin(event) {
    event.preventDefault();

    const {
      emailInputVal: email,
      passwordInputVal: password
    } = this.state;

    if (this.isValidLogin({ email, password })) {
      try {
        const response = await this.props.client.login({ email, password });
        this.props.cookieManager.setCookie(response.data.id, response.data.ttl);
      } catch (error) {
        this.setState({
          error: 'Unable to login, please try again.'
        });
      }
    }
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
    return (
      <div>
        <div>
          {this.state.error && <div>{this.state.error}</div>}
        </div>
        {
          this.props.isAuthenticated ?
          <div>You are all set!</div> :
          <div>
            <span>If you are trying to register for the first time, <Link to="/register">click here</Link>.</span>
            <form onSubmit={this.onLogin}>
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