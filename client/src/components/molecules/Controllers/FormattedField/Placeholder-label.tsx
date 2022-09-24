import React from "react";
import CurrencyFormat from "react-number-format";
import Error from "../Elements/FieldError";
import { DynamicLabelInput } from "../styles";
import Label from "../Elements/FieldLabel";

const FormattedField = ({
  isAllowed,
  mask,
  autoFocus = false,
  format,
  value = "",
  displayType,
  label = "",
  valid,
  disabled = false,
  message = "",
  onChange,
  name = "field",
  placeholder = "",
  ...props
}: any) => {
  const isValid = !!(valid && !message);
  const error = !!message;

  return (
    <DynamicLabelInput
      className={`textField ${
        error ? "isError" : ""
      } textField-placeholder-label ${isValid ? "valid" : ""} ${
        value ? "isFilled" : ""
      }`}
    >
      <div className="input-wrapper">
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
        {label ? <Label label={label} /> : ""}
      </div>

      <Error message={message} />
    </DynamicLabelInput>
  );
};

export default FormattedField;
