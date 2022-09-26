import React from "react";
import { useHistory } from "react-router-dom";
import Layout from "../../layouts/LOS";
import ProgressBar from "../../components/templates/LOS/ProgressBar";
import { routes } from "../../routes/los/routes";
import { ContainerInternal as Container } from "../../layouts/LOS/Containers";
import { ReactComponent as Img } from "../../assets/svgs/illustrations/mother-money.svg";
import Form from "../../components/templates/LOS/Childcare/Form";

const Childcare = () => {
  const history = useHistory();
  const goBackHandler = () => {
    history.push(routes.INCOME);
  };
  return (
    <Layout goBackHandler={goBackHandler}>
      <ProgressBar currentRoute={routes.CHILDCARE} />
      <Container>
        <Form />
        <Img />
      </Container>
    </Layout>
  );
};

export default Childcare;
