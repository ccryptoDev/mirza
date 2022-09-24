import React from "react";
import CurrencyFormat from "react-number-format";
import Error from "../Elements/FieldError";
import { InputWrapper } from "../styles";
import Label from "../Elements/FieldLabel";

const FormattedField = ({
  isAllowed,
  mask,
  autoFocus = false,
  format,
  value = "",
  displayType,
  label = "",
  disabled = false,
  message = "",
  onChange,
  name = "field",
  placeholder = "",
  ...props
}: any) => {
  const error = !!message;
  return (
    <InputWrapper
      className={`textField ${error ? "isError" : ""} ${
        value ? "isFilled" : ""
      }`}
    >
      {label ? <Label label={label} /> : ""}
      <CurrencyFormat
        displayType={displayType}
        isAllowed={isAllowed}
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        name={name}
        onValueChange={(values: any) => {
          onChange({
            target: {
              name,
              value: values.value,
            },
          });
        }}
        mask={mask}
        format={format}
        autoFocus={autoFocus}
        {...props}
      />

      <Error message={message} />
    </InputWrapper>
  );
};

export default FormattedField;
