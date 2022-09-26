import React from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { Button as CancelApplication } from "../../../atoms/Buttons/Regular";
import Button from "../../../molecules/Buttons/SubmitButton";
import { ReactComponent as Arrow } from "../../../../assets/svgs/icons/arrow/arrow-right.svg";
import { ReactComponent as Check } from "../../../../assets/svgs/icons/actions/tick.svg";
import { ReactComponent as Cross } from "../../../../assets/svgs/icons/actions/cross-sm.svg";
import { ContainerInternal as Container } from "../../../../layouts/LOS/Containers";
import { routes } from "../../../../routes/los/routes";
import { TextM as Text } from "../../../atoms/Typography";

const Wrapper = styled.div`
  .cancel-btn {
    max-width: 290px;
  }

  .address {
    margin-top: 32px;
  }

  .submit-btn {
    width: 445px;
    margin-left: auto;
  }

  .check-icon {
    & path {
      fill: #fff;
    }
  }
`;

const renderIcon = (type: any) => {
  switch (type) {
    case "check":
      return <Check className="check-icon" />;
    default:
      return <Arrow />;
  }
};

const Footer = ({
  confirmButtonText,
  onSubmit,
  icon,
  ...props
}: {
  confirmButtonText: string;
  onSubmit: any;
  icon?: any;
}) => {
  const history = useHistory();

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

        <Button
          onClick={onSubmit}
          {...props}
          className="contained icon submit-btn"
        >
          {confirmButtonText} {renderIcon(icon)}
        </Button>
      </Container>
      <Container>
        <Text className="address">
          Need to ask us questions before proceeding? <br /> Email us at{" "}
          <a href="mailto:support@heymirza.com">support@heymirza.com</a>
        </Text>
      </Container>
    </Wrapper>
  );
};

export default Footer;
