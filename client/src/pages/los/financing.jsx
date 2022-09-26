import React from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import Layout from "../../layouts/LOS";
import ProgressBar from "../../components/templates/LOS/ProgressBar";
import { routes } from "../../routes/los/routes";
import Header from "../../components/templates/LOS/Components/Header-2";
import Body from "../../components/templates/LOS/Financing/Body";
import Footer from "../../components/templates/LOS/Financing/Footer";
import { ReactComponent as Img } from "../../assets/svgs/illustrations/view-bills.svg";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const Forgiveness = () => {
  const history = useHistory();

  const onSubmitHandler = () => {
    history.push(routes.OFFER);
  };
  return (
    <Layout>
      <ProgressBar currentRoute={routes.FINANCING_APPLY} />
      <Wrapper>
        <Header
          img={Img}
          heading="Let's get you set up"
          subheading="It will take about 5 minutes to verify your income and employment, and connect your bank so that you can receive disbursements."
        />
        <Body />
        <Footer
          confirmButtonText="Connect your bank account"
          onSubmit={onSubmitHandler}
        />
      </Wrapper>
    </Layout>
  );
};

export default Forgiveness;
