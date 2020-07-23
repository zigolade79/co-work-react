import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch } from "react-router-dom";

import "assets/scss/material-kit-react.scss?v=1.9.0";

// pages for this product
import Components from "views/Components/Components.js";
import LandingPage from "views/LandingPage/LandingPage.js";
import ProfilePage from "views/ProfilePage/ProfilePage.js";
import LoginPage from "views/LoginPage/LoginPage.js";
import EditOrg from "views/EditOrg/EditOrg.js";

//apollo wraper
import { ApolloProvider } from "react-apollo";
import apolloClient from "./config/createApolloClient";

var hist = createBrowserHistory();

ReactDOM.render(
  <ApolloProvider client={apolloClient}>
    <Router history={hist}>
      <Switch>
        <Route path="/profile-page" component={ProfilePage} />
        <Route path="/login-page" component={LoginPage} />
        <Route path="/component" component={Components} />
        <Route path="/edit-org" component={EditOrg} />
        <Route path="/" component={LandingPage} />
      </Switch>
    </Router>
  </ApolloProvider>,
  document.getElementById("root")
);
