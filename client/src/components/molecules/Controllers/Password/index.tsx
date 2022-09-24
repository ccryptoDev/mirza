import React, { useState } from "react";
import styled from "styled-components";
import { ReactComponent as ShowPassword } from "./password-show.svg";
import { ReactComponent as HidePassword } from "./password-hide.svg";
import Error from "../Elements/FieldError";
import { PasswordWrapper } from "../styles";
import Label from "../Elements/FieldLabel";

const Icon = styled.button`
  position: absolute;
  top: 0;
  right: 6px;
  cursor: pointer;
  border: none;
  background: transparent;
  width: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
`;

const InputField = ({
  value,
  label = "",
  disabled = false,
  message = "",
  onChange,
  name,
  placeholder,
}: any) => {
  const [show, setShow] = useState(false);
  const showPasswordHandler = () => {
    setShow(!show);
  };
  const error = !!message;
  return (
    <PasswordWrapper
      className={`textField ${error ? "isError" : ""} ${
        value ? "isFilled" : ""
      }`}
    >
      {label ? <Label label={label} /> : ""}
      <div style={{ position: "relative" }}>
        <input
          className={`input-password ${value ? "filled" : ""}`}
          value={value}
          disabled={disabled}
          placeholder={placeholder}
          type={show ? "text" : "password"}
          name={name}
          onChange={onChange}
        />
        <Icon className="icon" type="button" onClick={showPasswordHandler}>
          {show ? <ShowPassword /> : <HidePassword />}
        </Icon>
      </div>

      <Error message={message} />
    </PasswordWrapper>
  );
};

export default InputField;
