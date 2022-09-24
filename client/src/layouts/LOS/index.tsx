import React from "react";
import styled from "styled-components";
import Header from "./Header";
import { ContainerLg as Container } from "./Containers";

const Wrapper = styled.div`
  main {
    min-height: calc(100vh - var(--header-height));
  }
`;

const Layout = ({
  children,
  goBackHandler,
}: {
  children: any;
  goBackHandler: any;
}) => {
  return (
    <Wrapper>
      <Header goBackHandler={goBackHandler} />
      <main>
        <Container className="container">{children}</Container>
      </main>
    </Wrapper>
  );
};

export default Layout;
