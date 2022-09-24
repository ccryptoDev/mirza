import React from "react";
import { Route, Switch, useParams } from "react-router-dom";
import { routes as route } from "./routes";
import Login from "../../pages/los/authorization/Login";
import Income from "../../pages/los/income";
import Childcare from "../../pages/los/childcare";
import { UserProvider } from "../../contexts/user";

const Routes = () => {
  const params = useParams();
  return (
    <UserProvider applicationId={params.id}>
      <Switch>
        <Route path={route.LOGIN} exact component={Login} />
        <Route path={route.INCOME} exact component={Income} />
        <Route path={route.CHILDCARE} exact component={Childcare} />
      </Switch>
    </UserProvider>
  );
};

export default Routes;
