import React from "react";
import styled from "styled-components";
import Header from "./Header";
import GreetingHeader from "../../components/templates/borrower/Header";

const Wrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Main = styled.div`
  padding: 0 4.8rem;
  display: grid;
  grid-template-rows: repeat(2, 1fr);
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 3.2rem;
`;

const Layout = ({ children }: { children: any }) => {
  return (
    <Wrapper>
      <Header />
      <GreetingHeader />
      <Main>{children}</Main>
    </Wrapper>
  );
};

export default Layout;
