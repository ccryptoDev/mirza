import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Layout from "../../layouts/LOS";
import ProgressBar from "../../components/templates/LOS/ProgressBar";
import { routes, pageName } from "../../routes/los/routes";
import Header from "../../components/templates/LOS/Components/Header-1";
import Body from "../../components/templates/LOS/Forgiveness/FullForgiveness-body";
import Footer from "../../components/templates/LOS/Components/Footer";
import { ReactComponent as Img } from "../../assets/svgs/illustrations/happy-shopping.svg";
import { reviewOfferApi, fetchContractApi } from "../../api/application";
import { useUserData } from "../../contexts/user";
import PrivateRoute from "../../routes/los/PrivateRoute";
import Loader from "../../components/molecules/Loaders/LoaderWrapper";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const Forgiveness = () => {
  const [data, setData] = useState({});
  const { screenId, goToPage } = useUserData();
  const [loading, setLoading] = useState(false);

  const fetchOffer = async () => {
    setLoading(true);
    await fetchContractApi(screenId);
    const result = await reviewOfferApi(screenId);
    setLoading(false);
    if (result && !result.error) {
      const {
        amount_financed: amountFinanced,
        apr,
        finance_charge: financedCharge,
        id,
        month_payment: monthPayment,
        term,
        total_payments: totalPayments,
      } = result.data;
      setData({
        amountFinanced,
        apr,
        financedCharge,
        id,
        monthPayment,
        term,
        totalPayments,
      });
    }
  };

  useEffect(() => {
    if (screenId) {
      fetchOffer();
    }
  }, [screenId]);

  const onSubmitHandler = async () => {
    setLoading(true);
    await goToPage(pageName.CONTRACT);
    setLoading(false);
  };
  return (
    <PrivateRoute route={routes.FORGIVENESS_FULL}>
      <Layout>
        <ProgressBar currentRoute={routes.FORGIVENESS_FULL} />
        <Loader loading={loading}>
          <Wrapper>
            <Header
              amount={data?.amountFinanced || 0}
              img={Img}
              heading="Your Loan Terms"
              subheading="The full loan amount will be disbursed in monthly installments over 12
            months. After 24 months, the loan amount will be completely forgiven."
            />
            <Body data={data} />
            <Footer
              confirmButtonText="Continue application"
              onSubmit={onSubmitHandler}
              loading={loading}
            />
          </Wrapper>
        </Loader>
      </Layout>
    </PrivateRoute>
  );
};

export default Forgiveness;
