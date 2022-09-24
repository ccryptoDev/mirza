import React from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { H2 as Heading, TextM as SubHeading } from "../../../atoms/Typography";
import Input from "../../../molecules/Controllers/FormattedField";
import Checkbox from "../../../molecules/Controllers/CheckBox/Custom";
import { Button } from "../../../atoms/Buttons/Regular";
import { ReactComponent as Arrow } from "../../../../assets/svgs/icons/arrow/arrow-right.svg";
import { validate } from "./validation";
import { routes } from "../../../../routes/los/routes";
import { useForm } from "../../../../hooks/form-control";

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
  const history = useHistory();

  const onSubmitHandler = (e: any) => {
    e.preventDefault();
    const [isValid, updatedForm] = validate(form);
    if (isValid) {
      history.push(routes.CHILDCARE);
    } else {
      setForm(updatedForm);
    }
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

        <Button className="contained icon" type="submit">
          Next
          <Arrow />
        </Button>
      </form>
    </Wrapper>
  );
};

export default Form;
