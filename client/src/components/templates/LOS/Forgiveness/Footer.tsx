import React from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { Button as CancelApplication } from "../../../atoms/Buttons/Regular";
import Button from "../../../molecules/Buttons/SubmitButton";
import { ReactComponent as Arrow } from "../../../../assets/svgs/icons/arrow/arrow-right.svg";
import { ReactComponent as Cross } from "../../../../assets/svgs/icons/actions/cross-sm.svg";
import { ContainerInternal as Container } from "../../../../layouts/LOS/Containers";
import { routes } from "../../../../routes/los/routes";

const Wrapper = styled.div`
  .cancel-btn {
    max-width: 290px;
  }

  .submit-btn {
    width: 445px;
    margin-left: auto;
  }
`;

const Footer = () => {
  const history = useHistory();

  const onSubmitHandler = () => {
    history.push(routes.FINANCING_APPLY);
  };

  const onCancelApplication = () => {
    history.push(routes.HOME);
  };

  return (
    <Wrapper>
      <Container>
        <CancelApplication
          className="outlined icon cancel-btn"
          onClick={onCancelApplication}
        >
          <Cross />
          Cancel Application
        </CancelApplication>

        <Button onClick={onSubmitHandler} className="contained icon submit-btn">
          Continue application <Arrow />
        </Button>
      </Container>
    </Wrapper>
  );
};

export default Footer;
