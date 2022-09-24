import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  color: red;
  font-size: 12px;
  text-align: left;
`;

const Component = ({ message }: any) => {
  return <>{message ? <Wrapper className="error">{message}</Wrapper> : ""}</>;
};

export default Component;
