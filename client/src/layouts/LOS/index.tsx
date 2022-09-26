import React from "react";
import styled from "styled-components";
import { Header1, Header2 } from "./Header";
import { ContainerLg as Container } from "./Containers";

const Wrapper = styled.div`
  main {
    min-height: calc(100vh - var(--header-height));
    padding-bottom: 40px;
  }
`;

const Layout = ({
  children,
  goBackHandler,
}: {
  children: any;
  goBackHandler: any;
}) => {
  const isBackButton = !!goBackHandler;
  return (
    <Wrapper>
      {isBackButton ? <Header1 goBackHandler={goBackHandler} /> : <Header2 />}
      <main>
        <Container className="container">{children}</Container>
      </main>
    </Wrapper>
  );
};

export default Layout;
