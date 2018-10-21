import React, { Component } from 'react';
import CaptureIncident from './components/CaptureIncident';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { withCookies } from 'react-cookie';

import logo from './logo.svg';
import './App.css';

import IncidentSubscription from './components/IncidentSubscription';
import Incidents from './components/Incidents';
import Login from './components/Login';
import Register from './components/Register';
import AuthedRoute from './components/AuthedRoute';

import STFClient from './shared/client';
import CookieManager from './shared/cookieManager';
import Link from 'react-router-dom/Link';
import VideoStream from './components/VideoStreamDevelopment';

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
            <Link to={"/"}>
              <img src={logo} className="App-logo" alt="Logo" />
            </Link>
            <div className="Links">
              <ul>
                <li>
                  <Link to="/subscribe">Subscribe to Incidents in your area.</Link>
                </li>
                <li>
                  <Link to="/incidents">All Incidents reported thus far.</Link>
                </li>
                <li>
                  <Link to="/videostream">Video Stream of Development of App</Link>
                </li>
              </ul>
            </div>
          </header>
          <div>
            <Route exact path="/" component={() => <CaptureIncident client={this.client} />} />
            <AuthedRoute
              exact
              path="/subscribe"
              isAuthenticated={isAuthenticated}
              client={this.client}
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
                  isAuthenticated={isAuthenticated}
                  cookieManager={this.cookieManager}
                />
              }
            />
            <Route
              exact
              path="/incidents"
              component={() =>
                <Incidents
                  client={this.client}
                />
              }
            />
            <Route
              exact
              path="/videostream"
              component={VideoStream}
            />
          </div>
          <div class="footer">
            Team Engine #9
          </div>
        </div>
      </Router>
    );
  }
}

export default withCookies(App);
