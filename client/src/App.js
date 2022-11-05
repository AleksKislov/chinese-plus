import React, { Fragment, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Landing from "./components/layout/Landing";
import Routes from "./components/routing/Routes";

import "./css/common.css";
import "./css/theme/App.css";
import "./css/myown.css";

// Redux
import { Provider } from "react-redux";
import store from "./store";
import { setAuthToken, setGoogleAuth } from "./utils/setAuthToken";
import { loadUser } from "./actions/auth";

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

if (localStorage.userid) {
  setGoogleAuth(localStorage.userid);
}

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  useEffect(() => {
    const style = document.getElementById("cssTheme");
    if (!style) return;
    style.href = +localStorage.isDarkTheme ? "/static/css/App-night.css" : "/static/css/App.css";
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          <Switch>
            <Route exact path='/' component={Landing} />

            <Route component={Routes} />
          </Switch>
          <Footer />
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;
