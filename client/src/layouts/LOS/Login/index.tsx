import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  min-height: 100vh;
  width: 100%;
  background: var(--color-bg-2);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Card = styled.main`
  padding: 100px 12px;
  display: flex;
  background: #fff;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-12);
  border-radius: 8px;
  max-width: 960px;
  width: 100%;
  min-height: 300px;
  position: relative;
`;

const Layout = ({ children }: any) => {
  return (
    <Wrapper>
      <Card>{children}</Card>
    </Wrapper>
  );
};
export default Layout;
