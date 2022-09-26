import React from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import Layout from "../../layouts/LOS";
import ProgressBar from "../../components/templates/LOS/ProgressBar";
import { routes } from "../../routes/los/routes";
import Header from "../../components/templates/LOS/Components/Header-1";
import Body from "../../components/templates/LOS/Forgiveness/FullForgiveness-body";
import Footer from "../../components/templates/LOS/Components/Footer";
import { ReactComponent as Img } from "../../assets/svgs/illustrations/happy-shopping.svg";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const Forgiveness = () => {
  const history = useHistory();

  const onSubmitHandler = () => {
    history.push(routes.FINANCING_APPLY);
  };
  return (
    <Layout>
      <ProgressBar currentRoute={routes.FORGIVENESS} />
      <Wrapper>
        <Header
          amount={12380}
          img={Img}
          heading="Your Loan Terms"
          subheading="The full loan amount will be disbursed in monthly installments over 12
          months. After 24 months, the loan amount will be completely forgiven."
        />
        <Body />
        <Footer
          confirmButtonText="Continue application"
          onSubmit={onSubmitHandler}
        />
      </Wrapper>
    </Layout>
  );
};

export default Forgiveness;
