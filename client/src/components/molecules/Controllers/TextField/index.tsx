import React from "react";
import Error from "../Elements/FieldError";
import { InputWrapper } from "../styles";
import Label from "../Elements/FieldLabel";

const InputField = ({
  value = "",
  label = "",
  type = "text",
  disabled = false,
  message = "",
  onChange,
  name = "field",
  placeholder = "",
}: any) => {
  const error = !!message;
  return (
    <InputWrapper
      className={`textField ${value ? "isFilled" : ""} ${
        error ? "isError" : ""
      } `}
    >
      {label ? <Label label={label} /> : ""}
      <div style={{ position: "relative" }}>
        <input
          value={value}
          disabled={disabled}
          placeholder={placeholder}
          type={type}
          name={name}
          onChange={onChange}
        />
      </div>
      <Error message={message} />
    </InputWrapper>
  );
};

export default InputField;
