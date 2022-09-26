import React from "react";
import { useHistory } from "react-router-dom";
import Layout from "../../layouts/LOS";
import ProgressBar from "../../components/templates/LOS/ProgressBar";
import { routes } from "../../routes/los/routes";
import { ContainerInternal as Container } from "../../layouts/LOS/Containers";
import { ReactComponent as Img } from "../../assets/svgs/illustrations/family-money.svg";
import Form from "../../components/templates/LOS/PreApproval/Form";

const PreApproval = () => {
  const history = useHistory();
  const goBackHandler = () => {
    history.push(routes.CHILDCARE);
  };
  return (
    <Layout goBackHandler={goBackHandler}>
      <ProgressBar currentRoute={routes.PRE_APPROVAL} />
      <Container>
        <Form />
        <Img />
      </Container>
    </Layout>
  );
};

export default PreApproval;
