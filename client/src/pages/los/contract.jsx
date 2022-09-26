import React, { useState } from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import Layout from "../../layouts/LOS";
import ProgressBar from "../../components/templates/LOS/ProgressBar";
import { routes } from "../../routes/los/routes";
import Header from "../../components/templates/LOS/Components/Header-2";
import Footer from "../../components/templates/LOS/Components/Footer";
import { ReactComponent as Img } from "../../assets/svgs/illustrations/sing-contract.svg";
import { useUserData } from "../../contexts/user";
import Agreement from "../../components/templates/LOS/Contract/Agreement";
import Checkbox from "../../components/molecules/Controllers/CheckBox/Custom";
import { mockRequest } from "../../utils/mockRequest";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;

  .subheading {
    max-width: 550px;
    font-size: 16px;
  }
`;

const Contract = () => {
  const [loading, setLoading] = useState(false);
  const { screenTrackingId, user, userId } = useUserData();
  const [agree, setAgree] = useState(false);
  const history = useHistory();

  const onSubmitHandler = async () => {
    setLoading(true);
    await mockRequest(3000);
    history.push(routes.COMPLETION);
  };

  const subheading = (
    <span>
      Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec odio.
      Quisque volutpat mattis eros. Nullam malesuada erat ut turpis. Suspendisse
      urna nibh, viverra non, semper suscipit, posuere a, pede.
      <br />
      <br />
      Donec nec justo eget felis facilisis fermentum. Aliquam porttitor mauris
      sit amet orci. Aenean dignissim pellentesque felis.
      <br />
      <br />
      Morbi in sem quis dui placerat ornare. Pellentesque odio nisi, euismod in,
      pharetra a, ultricies in, diam. Sed arcu. Cras consequat.
    </span>
  );

  return (
    <Layout>
      <ProgressBar currentRoute={routes.CONTRACT} />
      <Wrapper>
        <Header
          img={Img}
          heading="Your Contract ACH Authorization"
          subheading={subheading}
        />
        <Agreement
          screenTrackingId={screenTrackingId}
          user={user}
          userId={userId}
        />
        <Checkbox
          value={agree}
          onChange={(e) => setAgree(e.target.value)}
          label="I certify that I have provided accurate information. I have read and understood all of the terms of this Loan Agreement, and  I willingly enter into this contract. "
        />
        <Footer
          confirmButtonText="Agree to contract"
          onSubmit={onSubmitHandler}
          icon="check"
          disabled={!agree}
          loading={loading}
        />
      </Wrapper>
    </Layout>
  );
};

export default Contract;
