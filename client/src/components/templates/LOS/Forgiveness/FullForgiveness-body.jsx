import React from "react";
import styled from "styled-components";
import { H4, H3, TextM as Text } from "../../../atoms/Typography";
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
          These loan payments will be disbursed over 12 months, with the first
          payment occuring on [date] and the final payment occuring on [date].
        </Text>
        <Text>
          Your company participates in loan forgiveness, meaning that after the
          forgiveness period of 24 months and your continued employment you will
          be forgiven $2,000 from the principal loan amount.
        </Text>
      </Wrapper>
      <Wrapper>
        <H4 className="heading">Forgiveness details</H4>
        <Table items={tableData({})} />
      </Wrapper>
    </Container>
  );
};

export default Body;
