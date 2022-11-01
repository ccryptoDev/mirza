import React, { useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { H2 as Heading, TextM as SubHeading } from "../../../atoms/Typography";
import Input from "../../../molecules/Controllers/FormattedField";
import Button from "../../../molecules/Buttons/SubmitButton";
import { ReactComponent as Arrow } from "../../../../assets/svgs/icons/arrow/arrow-right.svg";
import { validate } from "./validation";
import { pageName } from "../../../../routes/los/routes";
import { useForm } from "../../../../hooks/form-control";
import Note from "./Note";
import { updateApplicationInfo } from "../../../../api/application";
import { useUserData } from "../../../../contexts/user";

const Wrapper = styled.div`
  & form {
    display: flex;
    flex-direction: column;
    gap: 32px;

    & .input-wrapper {
      & .subheading {
        margin-bottom: 20px;
      }

      & .textField {
        max-width: 160px;
      }
    }

    & button {
      max-width: 192px;
    }
  }
`;

const initForm = () => {
  return {
    requestedAmount: { value: "", message: "" },
  };
};

const Form = () => {
  const { form, setForm, onChangeHandler } = useForm({ initForm });
  const { fetchUser } = useUserData();
  const [loading, setLoading] = useState(false);
  const params: any = useParams();

  const onSubmitHandler = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const [isValid, updatedForm] = validate(form);
    const screenId: string = params?.id;
    if (isValid && screenId) {
      const payload = {
        requestedAmount: +form.requestedAmount.value,
        screenId,
        currentScreen: pageName.PRE_APPROVAL,
      };
      const result = await updateApplicationInfo(payload);
      if (result && !result.error) {
        await fetchUser(screenId);
      }
    } else {
      setForm(updatedForm);
    }
    setLoading(false);
  };

  return (
    <Wrapper>
      <form onSubmit={onSubmitHandler}>
        <Heading className="heading">Annual childcare expenses</Heading>
        <div className="input-wrapper">
          <SubHeading className="subheading">
            We&apos;ve pulled in your current costs of childcare. Please include
            any additional childcare expenses for the upcoming year.
          </SubHeading>
          <Input
            onChange={onChangeHandler}
            value={form.requestedAmount.value}
            message={form.requestedAmount.message}
            name="requestedAmount"
            thousandSeparator
            prefix="$"
          />
        </div>
        <Note />
        <Button className="contained icon" type="submit" loading={loading}>
          Next
          <Arrow />
        </Button>
      </form>
    </Wrapper>
  );
};

export default Form;
