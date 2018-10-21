import React from 'react';
import { Route } from 'react-router-dom';
import Redirect from 'react-router-dom/Redirect';

const AuthedRoute = ({ component: Component, isAuthenticated, client, cookieManager, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        return (
          isAuthenticated ? (
            <Component
              client={client}
              cookieManager={cookieManager}
              {...props}
            />
          ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: props.location }
              }}
            />
          )
        );
      }}
    />
  );
};

export default AuthedRoute;