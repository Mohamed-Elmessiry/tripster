import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './pages/home';
import Venue from './pages/venue';
// import { Venue } from './pages/venue';

export default function Routes() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/venue">
          <Venue/>

        </Route>
      </Switch>
    </Router>
  );
}
