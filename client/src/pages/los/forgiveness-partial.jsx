import React from "react";
import styled from "styled-components";
import Layout from "../../layouts/LOS";
import ProgressBar from "../../components/templates/LOS/ProgressBar";
import { routes } from "../../routes/los/routes";
import Header from "../../components/templates/LOS/Components/Header-1";
import Body from "../../components/templates/LOS/Forgiveness/PartialForgiveness-body";
import Footer from "../../components/templates/LOS/Forgiveness/Footer";
import { ReactComponent as Img } from "../../assets/svgs/illustrations/happy-shopping.svg";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const Forgiveness = () => {
  return (
    <Layout>
      <ProgressBar currentRoute={routes.FORGIVENESS} />
      <Wrapper>
        <Header
          amount={12380}
          img={Img}
          loanTerms="The full loan amount will be disbursed in monthly installments over 12
          months. After 24 months, the loan amount will be completely forgiven."
        />
        <Body />
        <Footer />
      </Wrapper>
    </Layout>
  );
};

export default Forgiveness;
