/* eslint-disable prettier/prettier */
import React from "react";
import Layout from "../../../layouts/borrower";
import ActivePaymentsCard from "../../../components/templates/borrower/ActivePaymentsCard";
import ContactSupportCard from "../../../components/templates/borrower/ContactSupportCard";
import VestingCard from "../../../components/templates/borrower/VestingCard";
import CompletedPayments from "../../../components/templates/borrower/CompletedPayments";
import MyLoanAtGlanceChart from "../../../components/templates/borrower/MyLoanAtGlance";

const MyLoan = (): JSX.Element => {
  return (
    <Layout>
      <div>
        <ActivePaymentsCard />
        <VestingCard />
        <ContactSupportCard />
      </div>
      <div>
        <CompletedPayments />
        <MyLoanAtGlanceChart />
      </div>
    </Layout>
  );
};

export default MyLoan;
