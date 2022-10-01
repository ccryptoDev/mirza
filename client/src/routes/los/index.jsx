import React from "react";
import { Route, Switch, useParams } from "react-router-dom";
import { routes as route } from "./routes";
import Login from "../../pages/los/authorization/Login";
import Income from "../../pages/los/income";
import Childcare from "../../pages/los/childcare";
import PreApproval from "../../pages/los/pre-approval";
import { UserProvider } from "../../contexts/user";
import ForgivenessFull from "../../pages/los/forgiveness-full";
import ForgivenessPartial from "../../pages/los/forgiveness-partial";
import Financing from "../../pages/los/financing";
import Offer from "../../pages/los/offer";
import Contract from "../../pages/los/contract";
import Completion from "../../pages/los/completion";

const Routes = () => {
  const params = useParams();
  return (
    <UserProvider applicationId={params.id}>
      <Switch>
        <Route path={route.HOME} exact component={Login} />
        <Route path={route.LOGIN} exact component={Login} />
        <Route path={route.INCOME} exact component={Income} />
        <Route path={route.CHILDCARE} exact component={Childcare} />
        <Route path={route.PRE_APPROVAL} exact component={PreApproval} />
        <Route
          path={route.FORGIVENESS_FULL}
          exact
          component={ForgivenessFull}
        />
        <Route
          path={route.FORGIVENESS_PARTIAL}
          exact
          component={ForgivenessPartial}
        />
        <Route path={route.FINANCING_APPLY} exact component={Financing} />
        <Route path={route.OFFER} exact component={Offer} />
        <Route path={route.CONTRACT} exact component={Contract} />
        <Route path={route.COMPLETION} exact component={Completion} />
      </Switch>
    </UserProvider>
  );
};

export default Routes;
