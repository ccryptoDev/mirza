import React from "react";
import styled from "styled-components";
import TextField from "../../../../molecules/Controllers/TextField/Placeholder-label";
import { ReactComponent as Icon } from "./envelope.svg";

const Wrapper = styled.div`
  position: relative;
  input {
    padding-right: 45px;
  }
  .icon-wrapper {
    position: absolute;
    top: 50%;
    right: 14px;
    transform: translate(0, -50%);
    z-index: 100;
    width: 3rem;
    display: flex;
    justify-content: center;
  }
`;

export const EmailField = (props: any) => {
  return (
    <Wrapper>
      <TextField {...props} icon={<Icon />} />
    </Wrapper>
  );
};

export default EmailField;
