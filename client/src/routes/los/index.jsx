import React from "react";
import { Route, Switch } from "react-router-dom";
import { routes as route } from "./routes";
import Login from "../../pages/los/authorization/Login";
import Income from "../../pages/los/income";
import Childcare from "../../pages/los/childcare";
import PreApproval from "../../pages/los/pre-approval";
import { UserProvider } from "../../contexts/user";
import ForgivenessFull from "../../pages/los/forgiveness-full";
// import Offer from "../../pages/los/offer";
import Contract from "../../pages/los/contract";
import Completion from "../../pages/los/completion";

const Routes = () => {
  return (
    <Switch>
      <Route path={route.HOME} exact component={Login} />
      <Route path={route.LOGIN} exact component={Login} />
      <Route path={`${route.INCOME}/:id`} exact component={Income} />
      <Route path={`${route.CHILDCARE}/:id`} exact component={Childcare} />
      <Route path={`${route.PRE_APPROVAL}/:id`} exact component={PreApproval} />
      <Route
        path={`${route.FORGIVENESS_FULL}/:id`}
        exact
        component={ForgivenessFull}
      />
      {/* <Route path={`${route.OFFER}/:id`} exact component={Offer} /> */}
      <Route path={`${route.CONTRACT}/:id`} exact component={Contract} />
      <Route path={`${route.COMPLETION}/:id`} exact component={Completion} />
    </Switch>
  );
};

const Component = () => {
  return (
    <UserProvider>
      <Routes />
    </UserProvider>
  );
};

export default Component;
