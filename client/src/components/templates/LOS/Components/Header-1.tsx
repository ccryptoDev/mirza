import React from "react";
import styled from "styled-components";
import {
  H2 as Heading,
  H4,
  TextM as SubHeading,
  H1,
} from "../../../atoms/Typography";
import { ReactComponent as LoanIcon } from "../../../../assets/svgs/loan-amount.svg";
import { ContainerInternal } from "../../../../layouts/LOS/Containers";
import { formatCurrency } from "../../../../utils/formats";

const Container = styled(ContainerInternal)`
  align-items: center;
  .illustration {
    margin-left: auto;
    display: block;
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;

  .subheading {
    max-width: 430px;
    margin: 24px 0 40px;
  }
  .loan-amount-wrapper {
    display: flex;
    align-items: center;
    gap: 32px;
    & svg {
      width: 120px;
    }
  }
  .loan-amount {
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 16px;
    & h1 {
      color: var(--color-green-4);
      span {
        font-weight: 700;
      }
    }
  }
`;

const Header = ({
  heading,
  subheading,
  amount,
  img: Img,
}: {
  heading: string;
  subheading: string;
  amount: number;
  img: any;
}) => {
  return (
    <Container>
      <Wrapper>
        <Heading>{heading}</Heading>
        <SubHeading className="subheading">{subheading}</SubHeading>
        <div>
          <div className="loan-amount-wrapper">
            <LoanIcon />
            <div className="loan-amount">
              <H4>Your loan amount is</H4>
              <H1>{formatCurrency(amount)}</H1>
            </div>
          </div>
        </div>
      </Wrapper>
      <Img className="illustration" />
    </Container>
  );
};

export default Header;
