import React from "react";
import { Route, Switch } from "react-router-dom";
import { routes as route } from "./routes";
import EmployeeDashboard from "../../pages/borrower/dashboard/EmployeeDashboard";
import MyLoan from "../../pages/borrower/dashboard/MyLoan";

const Routes = () => {
  return (
    <Switch>
      <Route path={route.DASHBOARD} exact component={EmployeeDashboard} />
      <Route path={route.MY_LOAN} exact component={MyLoan} />
    </Switch>
  );
};

export default Routes;
