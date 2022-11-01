import React from "react";
import { useHistory } from "react-router-dom";
import Layout from "../../layouts/LOS";
import ProgressBar from "../../components/templates/LOS/ProgressBar";
import { routes, pageName } from "../../routes/los/routes";
import { ContainerInternal as Container } from "../../layouts/LOS/Containers";
import { ReactComponent as Img } from "../../assets/svgs/illustrations/mother-money.svg";
import Form from "../../components/templates/LOS/Childcare/Form";
import PrivateRoute from "../../routes/los/PrivateRoute";
import { useUserData } from "../../contexts/user";

const Childcare = () => {
  const { goToPage } = useUserData();
  const goBackHandler = () => {
    goToPage(pageName.INCOME);
  };
  return (
    <PrivateRoute route={routes.CHILDCARE}>
      <Layout goBackHandler={goBackHandler}>
        <ProgressBar currentRoute={routes.CHILDCARE} />
        <Container>
          <Form />
          <Img />
        </Container>
      </Layout>
    </PrivateRoute>
  );
};

export default Childcare;
