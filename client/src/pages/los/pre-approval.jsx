import React from "react";

import Layout from "../../layouts/LOS";
import ProgressBar from "../../components/templates/LOS/ProgressBar";
import { routes, pageName } from "../../routes/los/routes";
import { ContainerInternal as Container } from "../../layouts/LOS/Containers";
import { ReactComponent as Img } from "../../assets/svgs/illustrations/family-money.svg";
import Form from "../../components/templates/LOS/PreApproval/Form";
import { useUserData } from "../../contexts/user";
import PrivateRoute from "../../routes/los/PrivateRoute";

const PreApproval = () => {
  const { goToPage } = useUserData();

  const goBackHandler = () => {
    goToPage(pageName.CHILDCARE);
  };
  return (
    <PrivateRoute route={routes.PRE_APPROVAL}>
      <Layout goBackHandler={goBackHandler}>
        <ProgressBar currentRoute={routes.PRE_APPROVAL} />
        <Container>
          <Form />
          <Img />
        </Container>
      </Layout>
    </PrivateRoute>
  );
};

export default PreApproval;
