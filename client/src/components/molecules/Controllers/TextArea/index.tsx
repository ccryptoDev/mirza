import React from "react";
import Error from "../Elements/FieldError";
import { InputWrapper } from "../styles";
import Label from "../Elements/FieldLabel";

const TextAreaField = ({
  value = "",
  label = "",
  cols = 30,
  rows = 10,
  valid,
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
      <div className="input-wrapper">
        {label ? <Label label={label} /> : ""}
        <textarea
          value={value}
          cols={cols}
          rows={rows}
          disabled={disabled}
          placeholder={placeholder}
          name={name}
          onChange={onChange}
        />
      </div>
      <Error message={message} />
    </InputWrapper>
  );
};

export default TextAreaField;
