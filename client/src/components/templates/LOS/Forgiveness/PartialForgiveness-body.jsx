import React from "react";
import styled from "styled-components";
import { H4 } from "../../../atoms/Typography";
import { ContainerInternal as Container } from "../../../../layouts/LOS/Containers";
import { formatCurrency } from "../../../../utils/formats";
import Table from "../Components/LOS-table";
import { parseDateToMDY } from "../../../../utils/parseDate";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 40px;
  border: 1px solid var(--color-gray-2);
  border-radius: 12px;

  & .heading {
    font-weight: 700;
  }

  & .amount {
    color: var(--color-green-4);
    &,
    span {
      font-weight: 700;
    }
  }
`;

const repaymentSchedule = ({
  gracePeriod = ["08/16/2022", "01/15/2023"],
  repaymentDate = "06/16/2023",
}) => [
  {
    label: "Grace period",
    value: (
      <div>
        {" "}
        {parseDateToMDY(gracePeriod[0])} - {parseDateToMDY(gracePeriod[1])}{" "}
      </div>
    ),
  },
  { label: "Final repayment date", value: parseDateToMDY(repaymentDate) },
];

const forgivenessDetails = ({
  totalRepayment = 0,
  monthlyPayroll = 512,
  totalForgiveness = 12380,
  amountForgiven = 250,
}) => [
  { label: "Loan forgiveness date*", value: "02/02/2024" },
  {
    label: "Monthly payroll schedule",
    value: <div className="value">{formatCurrency(monthlyPayroll)}/mo</div>,
  },
  { label: "Term length", value: "24 months" },
  { label: "Total loan repayments", value: formatCurrency(totalRepayment) },
  {
    label: "Amount forgiven per quarter",
    value: formatCurrency(amountForgiven),
  },
  {
    label: "Amount that will be forgiven per [month/quarter]",
    value: formatCurrency(totalRepayment),
  },
  {
    label: "Total forgiveness amount",
    value: formatCurrency(totalForgiveness),
  },
];

const Body = () => {
  return (
    <Container>
      <Wrapper>
        <H4 className="heading">Forgiveness details</H4>
        <Table items={forgivenessDetails({})} />
      </Wrapper>
      <Wrapper>
        <H4 className="heading">Repayment schedule</H4>
        <Table items={repaymentSchedule({})} />
      </Wrapper>
    </Container>
  );
};

export default Body;
