import React from "react";
import styled from "styled-components";
import {
  H4,
  H3,
  TextM as Text,
  TextS as Note,
} from "../../../atoms/Typography";
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

const tableData = ({
  totalRepayment = 0,
  amountForgiven = 1254,
  totalForgiveness = 12380,
}) => [
  { label: "Loan forgiveness date", value: parseDateToMDY("02/02/2024") },
  { label: "Term length", value: "24 months" },
  { label: "Total loan repayments", value: formatCurrency(totalRepayment) },
  {
    label: "Amount forgiven per quarter",
    value: formatCurrency(amountForgiven),
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
        <H4 className="heading">
          12 month disbursement plan <br />
          24 months forgiveness
        </H4>
        <H3 className="amount">{formatCurrency(1037.6)}/mo</H3>
        <Text>
          Your loan payments will be disbursed over 12 months, with the first
          payment occurring on [date] and the final payment occurring on [date].
        </Text>
        <Text>
          Your company offers the option to vest forgiveness of your loan
          principal in exchange for you staying at the company. Each quarter,
          1/8 of your loan will be forgiven. If you leave before two years, you
          will need to pay back the remaining balance.
        </Text>
      </Wrapper>
      <Wrapper>
        <H4 className="heading">Forgiveness details</H4>
        <Table items={tableData({})} />
        <Note>
          * $0 repayments based on 2 years of retention at your company
        </Note>
      </Wrapper>
    </Container>
  );
};

export default Body;
