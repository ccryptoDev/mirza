import React from "react";
import Layout from "../../../layouts/borrower";
import ActivePaymentsCard from "../../../components/templates/borrower/ActivePaymentsCard";
import VestingCard from "../../../components/templates/borrower/VestingCard";
import ContactSupportCard from "../../../components/templates/borrower/ContactSupportCard";

const EmployeeDashboard = (): JSX.Element => {
  return (
    <Layout>
      <ActivePaymentsCard />
      <VestingCard />
      <ContactSupportCard />
    </Layout>
  );
};

export default EmployeeDashboard;
