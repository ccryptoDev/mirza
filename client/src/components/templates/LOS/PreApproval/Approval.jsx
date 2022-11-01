import React, { useState } from "react";
import styled from "styled-components";
import {
  H2 as Heading,
  H3 as Heading2,
  TextM as SubHeading,
} from "../../../atoms/Typography";
import { ReactComponent as Arrow } from "../../../../assets/svgs/icons/arrow/arrow-right.svg";
import { pageName } from "../../../../routes/los/routes";
import Button from "../../../molecules/Buttons/SubmitButton";
import { formatCurrency } from "../../../../utils/formats";
import { updateApplicationInfo } from "../../../../api/application";
import { useUserData } from "../../../../contexts/user";

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
  const [loading, setLoading] = useState(false);
  const { fetchUser, screenId } = useUserData();

  const onSubmitHandler = async () => {
    setLoading(true);
    const payload = {
      currentScreen: pageName.FORGIVENESS_FULL,
      screenId,
    };
    const result = await updateApplicationInfo(payload);
    if (result && !result.error) {
      await fetchUser(screenId);
    }
    setLoading(false);
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
        <Button
          className="contained icon"
          onClick={onSubmitHandler}
          loading={loading}
        >
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
