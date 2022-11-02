import React from "react";
import { useHistory, useParams } from "react-router-dom";
import { useUserData } from "../../../contexts/user";

const privateRoutes: any[] = [];

type IProps = {
  children: any;
  route: string;
};

const PrivateRoute = ({ children, route }: IProps) => {
  const { user, loading } = useUserData();
  const history = useHistory();
  const params: any = useParams();

  // if authorized go to current screen
  if (user?.isAuthorized && !loading && params?.id) {
    const currentScreenUrl = `/application/${user.data.currentScreen}`;
    if (currentScreenUrl !== route) {
      history.push(`${currentScreenUrl}/${params.id}`);
      return <></>;
    }
  }

  // redirect unauthorized user from a private page to the public home page
  if (!user?.isAuthorized && !loading && privateRoutes.indexOf(route) !== -1) {
    history.push("/application");
    return <></>;
  }

  // otherwise load the route that matches the current url
  return children;
};

export default PrivateRoute;
