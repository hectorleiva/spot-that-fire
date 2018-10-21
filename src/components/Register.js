import React, { Component } from 'react';
import validator from 'validator';

const initialState = {
  isAuthorized: false,
  emailInputVal: '',
  passwordInputVal: '',
  error: ''
};

export default class Register extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  onBlurCapture(event) {
    const fieldName = event.target.name;
    const fieldValue = event.target.value;

    this.setState({
      [`${fieldName}Val`]: fieldValue
    });
  }

  async onRegister() {
    const {
      email,
      password
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
        this.props.client.login({ email, password });
      } catch (error) {
        this.setState({
          error: error.message
        });
      }
    }
  }

  validateLogin({ email, password }) {
    let errorMessage = '';
    const validationRules = {
      min: 5,
      max: 30
    };

    if (validator.isEmail(email) && validator.isLength(password, validationRules)) {
      return true;
    }

    if (!validator.isEmail(email)) {
      errorMessage += 'Invalid email passed.';
    }

    if (!validator.isLength(password, validationRules)) {
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
              type="text"
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
    )
  }
}