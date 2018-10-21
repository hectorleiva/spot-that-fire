import React, { Component } from 'react';
import CaptureIncident from './components/CaptureIncident';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { withCookies } from 'react-cookie';

import logo from './logo.svg';
import './App.css';

import IncidentSubscription from './components/IncidentSubscription';
import Login from './components/Login';
import Register from './components/Register';
import AuthedRoute from './components/AuthedRoute';

import STFClient from './shared/client';
import CookieManager from './shared/cookieManager';

class App extends Component {
  constructor(props) {
    super(props);

    this.cookieManager = new CookieManager(this.props.cookies);
    this.client = new STFClient();
  }

  render() {
    const isAuthenticated = this.cookieManager.checkCookie();

    return (
      <Router>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="Logo" />
          </header>
          <div>
            <Route exact path="/" component={() => <CaptureIncident client={this.client} />} />
            <AuthedRoute
              exact
              path="/subscribe"
              isAuthenticated={isAuthenticated}
              isClient={this.client}
              cookieManager={this.cookieManager}
              component={IncidentSubscription}
            />
            <Route
              exact
              path="/login"
              render={(props) =>
                <Login
                  client={this.client}
                  cookieManager={this.cookieManager}
                  isAuthenticated={isAuthenticated}
                  {...props}
                />
              }
            />
            <Route
              exact
               path="/register"
               component={() =>
                <Register
                  client={this.client}
                  cookieManager={this.cookieManager}
                />
              }
            />
          </div>
        </div>
      </Router>
    );
  }
}

export default withCookies(App);
