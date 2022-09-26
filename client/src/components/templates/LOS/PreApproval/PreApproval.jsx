import React from "react";
import styled from "styled-components";
import { H2 as Heading, TextM as SubHeading } from "../../../atoms/Typography";
import { ReactComponent as Arrow } from "../../../../assets/svgs/icons/arrow/arrow-right.svg";
import Button from "../../../molecules/Buttons/SubmitButton";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  .layout {
    display: flex;
    justify-content: center;
    gap: 32px;
    flex-direction: column;

    & button {
      margin-top: 32px;
      width: 320px;
    }
  }
`;

const Form = ({ openArgyle, loading }) => {
  return (
    <Wrapper>
      <div className="layout">
        <Heading className="heading">Connect your employer account</Heading>
        <SubHeading className="subheading">
          Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec odio.
          Quisque volutpat mattis eros.
        </SubHeading>
        <div>
          <Button
            className="contained icon"
            onClick={openArgyle}
            loading={loading}
          >
            Begin application
            <Arrow />
          </Button>
        </div>
      </div>
    </Wrapper>
  );
};

export default Form;
