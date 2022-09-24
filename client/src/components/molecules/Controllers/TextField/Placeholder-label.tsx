import React from "react";
import Error from "../Elements/FieldError";
import { DynamicLabelInput } from "../styles";
import Label from "../Elements/FieldLabel";

const InputField = ({
  value = "",
  label = "",
  type = "text",
  disabled = false,
  message = "",
  onChange,
  name = "field",
  placeholder = " ",
  icon,
}: any) => {
  const error = !!message;
  return (
    <DynamicLabelInput
      className={`textField ${
        error ? "isError" : ""
      } textField-placeholder-label ${value ? "isFilled" : ""}`}
    >
      <div className="input-wrapper">
        <input
          value={value}
          disabled={disabled}
          placeholder={placeholder}
          type={type}
          name={name}
          onChange={onChange}
        />
        {label ? <Label label={label} /> : ""}
        {icon ? <div className="icon-wrapper">{icon}</div> : ""}
      </div>

      <Error message={message} />
    </DynamicLabelInput>
  );
};

export default InputField;
