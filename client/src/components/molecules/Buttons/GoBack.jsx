import React from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { ReactComponent as Chevron } from "../../../assets/svgs/chevron-left.svg";

const Button = styled.div`
  width: 36px;
  height: 36px;

  border: 1px solid var(--color-primary-green-1);
  box-sizing: border-box;
  border-radius: 50%;
  background: #fff;

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;
  svg {
    width: 6px;
  }
`;

const GoBackButton = () => {
  const history = useHistory();

  return (
    <Button type="button" onClick={() => history.goBack()}>
      <Chevron />
    </Button>
  );
};

export default GoBackButton;
