import React, { useState } from "react";
import styled from "styled-components";
import Layout from "../../layouts/LOS";
import ProgressBar from "../../components/templates/LOS/ProgressBar";
import { routes, pageName } from "../../routes/los/routes";
import Header from "../../components/templates/LOS/Components/Header-2";
import Footer from "../../components/templates/LOS/Components/Footer";
import { ReactComponent as Img } from "../../assets/svgs/illustrations/sing-contract.svg";
import { useUserData } from "../../contexts/user";
import Agreement from "../../components/templates/LOS/Contract/Agreement";
import Checkbox from "../../components/molecules/Controllers/CheckBox/Custom";
import PrivateRoute from "../../routes/los/PrivateRoute";
import { finalizeContractApi } from "../../api/application";

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
  const { goToPage } = useUserData();
  const [agree, setAgree] = useState(false);

  const onSubmitHandler = async () => {
    setLoading(true);
    await finalizeContractApi();
    await goToPage(pageName.FORGIVENESS_FULL);
    setLoading(false);
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
    <PrivateRoute route={routes.CONTRACT}>
      <Layout>
        <ProgressBar currentRoute={routes.CONTRACT} />
        <Wrapper>
          <Header
            img={Img}
            heading="Your Contract ACH Authorization"
            subheading={subheading}
          />
          <Agreement />
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
    </PrivateRoute>
  );
};

export default Contract;
