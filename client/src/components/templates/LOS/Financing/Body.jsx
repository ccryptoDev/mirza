import React from "react";
import styled from "styled-components";
import { H4, TextM as Text } from "../../../atoms/Typography";
import { ReactComponent as BankLogos } from "../../../../assets/svgs/bank-logos.svg";

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  gap: 20px;
  padding: 40px;
  border: 1px solid var(--color-gray-2);
  border-radius: 12px;

  .description {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 24px;
    max-width: 600px;
  }
`;

const Body = () => {
  return (
    <Wrapper>
      <div className="description">
        <H4>Connect your bank</H4>
        <Text>
          In the instance that you leave your job, we will no longer collect
          loan repayments from payroll and instead use this account to collect
          repayments.
        </Text>
      </div>
      <BankLogos />
    </Wrapper>
  );
};

export default Body;
