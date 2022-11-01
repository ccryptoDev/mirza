import React, { useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { H2 as Heading, TextM as SubHeading } from "../../../atoms/Typography";
import Input from "../../../molecules/Controllers/FormattedField";
import Checkbox from "../../../molecules/Controllers/CheckBox/Custom";
import Button from "../../../molecules/Buttons/SubmitButton";
import { ReactComponent as Arrow } from "../../../../assets/svgs/icons/arrow/arrow-right.svg";
import { validate } from "./validation";
import { pageName } from "../../../../routes/los/routes";
import { useForm } from "../../../../hooks/form-control";
import { updateApplicationInfo } from "../../../../api/application";
import { useUserData } from "../../../../contexts/user";

const Wrapper = styled.div`
  & .heading {
    margin: 32px 0;
  }
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
      margin-top: 30px;
      max-width: 192px;
    }
  }
`;

const initForm = () => {
  return {
    income: { value: "", message: "" },
    agree: { value: "", message: "" },
  };
};

const Form = () => {
  const { form, setForm, onChangeHandler } = useForm({ initForm });
  const { fetchUser, screenId } = useUserData();
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (e: any) => {
    e.preventDefault();
    const [isValid, updatedForm] = validate(form);
    setLoading(true);
    if (isValid && screenId) {
      const payload = {
        annualIncome: +form.income.value,
        screenId,
        currentScreen: pageName.CHILDCARE,
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
      <Heading className="heading">Annual income</Heading>
      <form onSubmit={onSubmitHandler}>
        <div className="input-wrapper">
          <SubHeading className="subheading">
            Confirm your information is correct; if not, please edit.
          </SubHeading>
          <Input
            onChange={onChangeHandler}
            value={form.income.value}
            message={form.income.message}
            name="income"
            thousandSeparator
            prefix="$"
          />
        </div>
        <SubHeading className="subheading">
          <b>We reserve the right to verify your income.</b>
        </SubHeading>
        <Checkbox
          onChange={onChangeHandler}
          className="text-center"
          value={form.agree.value}
          message={form.agree.message}
          name="agree"
          label="I confirm that my information is correct."
        />

        <Button className="contained icon" type="submit" loading={loading}>
          Next
          <Arrow />
        </Button>
      </form>
    </Wrapper>
  );
};

export default Form;
