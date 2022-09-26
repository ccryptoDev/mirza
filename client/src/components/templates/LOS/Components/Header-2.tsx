import React from "react";
import styled from "styled-components";
import { H2 as Heading, TextXL as SubHeading } from "../../../atoms/Typography";
import { ContainerInternal } from "../../../../layouts/LOS/Containers";

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
  justify-content: center;

  .subheading {
    max-width: 500px;
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
  img: Img,
}: {
  heading: string;
  subheading: string;
  img: any;
}) => {
  return (
    <Container>
      <Wrapper>
        <Heading>{heading}</Heading>
        <SubHeading className="subheading">{subheading}</SubHeading>
      </Wrapper>
      <Img className="illustration" />
    </Container>
  );
};

export default Header;
