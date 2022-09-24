import React, { useState } from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { H3, TextM as Text } from "../../../../atoms/Typography";
import { initForm, renderFields } from "./config";
import { Button, LinkButton } from "../../../../atoms/Buttons/Regular";
import { routes } from "../../../../../routes/los/routes";
import { header, main, container } from "../styles";
import { validate } from "./validate";

const Wrapper = styled.div`
  ${header}
  ${main}
  ${container}

  form {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 24px;

    .form-field {
      &:nth-child(1),
      &:nth-child(2) {
        grid-column: 1 / -1;
      }
    }
  }
`;

const Login = () => {
  const [form, setForm] = useState(initForm());
  const history = useHistory();

  const onChange = (e: any) => {
    const { value, name } = e.target;
    setForm((prevState) => ({ ...prevState, [name]: { value, message: "" } }));
  };

  const onSubmit = (e: any) => {
    e.preventDefault();
    const [isValid, updatedForm] = validate(form);
    if (isValid) {
      history.push(routes.HOME);
    } else {
      setForm(updatedForm);
    }
  };

  return (
    <Wrapper>
      <H3 className="heading">Login</H3>
      <Text className="subtitle">
        Please, enter your email which is connected to your account.
      </Text>
      <form className="container" onSubmit={onSubmit}>
        {renderFields(form).map(({ component: Component, ...field }) => {
          return (
            <div className="form-field" key={field.name}>
              <Component {...field} onChange={onChange} />
            </div>
          );
        })}
        <LinkButton to={routes.FORGOT_PASSWORD} className="text">
          forgot password?
        </LinkButton>
        <Button type="submit" className="contained">
          LOG IN
        </Button>
      </form>
    </Wrapper>
  );
};

export default Login;
