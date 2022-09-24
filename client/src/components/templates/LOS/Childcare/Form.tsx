import React from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { H2 as Heading, TextM as SubHeading } from "../../../atoms/Typography";
import Input from "../../../molecules/Controllers/FormattedField";
import { Button } from "../../../atoms/Buttons/Regular";
import { ReactComponent as Arrow } from "../../../../assets/svgs/icons/arrow/arrow-right.svg";
import { validate } from "./validation";
import { routes } from "../../../../routes/los/routes";
import { useForm } from "../../../../hooks/form-control";
import Note from "./Note";

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
      history.push(routes.PRE_APPROVAL);
    } else {
      setForm(updatedForm);
    }
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
            value={form.income.value}
            message={form.income.message}
            name="income"
            thousandSeparator
            prefix="$"
          />
        </div>
        <Note />
        <Button className="contained icon" type="submit">
          Next
          <Arrow />
        </Button>
      </form>
    </Wrapper>
  );
};

export default Form;
