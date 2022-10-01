import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Guide from "../pages/style-guide";
import Application from "./los";
import Borrower from "./borrower";

const Routes = () => {
  return (
    <Router>
      <Switch>
        <Route path="/styles" component={Guide} />
        <Route path="/application" component={Application} />
        <Route path="/borrower" component={Borrower} />
      </Switch>
    </Router>
  );
};

export default Routes;
