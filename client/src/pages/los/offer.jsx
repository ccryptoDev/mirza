import React from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import Layout from "../../layouts/LOS";
import ProgressBar from "../../components/templates/LOS/ProgressBar";
import { routes } from "../../routes/los/routes";
import Header from "../../components/templates/LOS/Components/Header-1";
import Body from "../../components/templates/LOS/Offer/Body";
import Footer from "../../components/templates/LOS/Components/Footer";
import { ReactComponent as Img } from "../../assets/svgs/illustrations/get-check.svg";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const Offer = () => {
  const history = useHistory();

  const onSubmitHandler = () => {
    history.push(routes.CONTRACT);
  };
  return (
    <Layout>
      <ProgressBar currentRoute={routes.OFFER} />
      <Wrapper>
        <Header
          amount={12380}
          img={Img}
          heading="Review your Loan Terms"
          subheading="The full loan amount will be disbursed in monthly installments over 12 months. Full principal forgiveness occurs after 24 months."
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

export default Offer;
