import React from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import {
  H2 as Heading,
  H3 as Heading2,
  TextM as SubHeading,
} from "../../../atoms/Typography";
import { ReactComponent as Arrow } from "../../../../assets/svgs/icons/arrow/arrow-right.svg";
import { routes } from "../../../../routes/los/routes";
import Button from "../../../molecules/Buttons/SubmitButton";
import { formatCurrency } from "../../../../utils/formats";

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  height: 100%;

  & button {
    margin-top: 32px;
    width: 320px;
  }
`;

const Form = ({ data }) => {
  const history = useHistory();
  const onSubmitHandler = () => {
    history.push(routes.FORGIVENESS_FULL);
  };
  return (
    <Wrapper>
      <Heading className="heading">Good News!</Heading>

      <Heading2 className="heading">
        Your employer will provide a childcare loan of up to
      </Heading2>

      <Heading className="heading">
        {formatCurrency(data?.approvedAmount)}
      </Heading>

      <div>
        <Button className="contained icon" onClick={onSubmitHandler}>
          Begin application
          <Arrow />
        </Button>
      </div>

      <SubHeading>
        Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec odio.
        Quisque volutpat mattis eros.
      </SubHeading>
    </Wrapper>
  );
};

export default Form;
