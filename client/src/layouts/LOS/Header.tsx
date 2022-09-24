import React from "react";
import styled from "styled-components";
import { ContainerLg as Container } from "./Containers";
import { ReactComponent as ArrowBack } from "../../assets/svgs/icons/arrow/arrow-left.svg";
import { Button } from "../../components/atoms/Buttons/Regular";
import { ReactComponent as Logo } from "../../assets/svgs/logo/logo.svg";

const Wrapper = styled.div`
  height: var(--header-height);
  background: #fff;
  border-bottom: 1px solid var(--color-gray-2);

  & .container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 100%;
  }

  .header-content-wrapper {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;

    & .text {
      padding: 0;
    }
  }
`;

const Header = ({ goBackHandler }: any) => {
  return (
    <Wrapper>
      <Container className="container">
        <div className="header-content-wrapper">
          <Button className="text icon" onClick={goBackHandler}>
            <ArrowBack />
            Back
          </Button>
          <Logo />
          <div />
        </div>
      </Container>
    </Wrapper>
  );
};

export default Header;
