import React, { useState } from "react";
import styled from "styled-components";
import { ReactComponent as ShowPassword } from "./password-show.svg";
import { ReactComponent as HidePassword } from "./password-hide.svg";
import Error from "../Elements/FieldError";
import { DynamicLabelPassword } from "../styles";
import Label from "../Elements/FieldLabel";

const Icon = styled.button`
  position: absolute;
  top: 0;
  right: 6px;
  cursor: pointer;
  border: none;
  background: transparent;
  width: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
`;

const InputField = ({
  value,
  label = "",
  disabled = false,
  message = "",
  onChange,
  name,
  placeholder = " ",
}: any) => {
  const [show, setShow] = useState(false);
  const showPasswordHandler = () => {
    setShow(!show);
  };
  const error = !!message;
  return (
    <DynamicLabelPassword
      className={`textField ${
        error ? "isError" : ""
      } textField-placeholder-label ${value ? "isFilled" : ""}`}
    >
      <div className="input-wrapper">
        <input
          className="input-password"
          value={value}
          disabled={disabled}
          placeholder={placeholder}
          type={show ? "text" : "password"}
          name={name}
          onChange={onChange}
        />
        {label ? <Label label={label} /> : ""}
        <Icon className="icon" type="button" onClick={showPasswordHandler}>
          {show ? <ShowPassword /> : <HidePassword />}
        </Icon>
      </div>

      <Error message={message} />
    </DynamicLabelPassword>
  );
};

export default InputField;
