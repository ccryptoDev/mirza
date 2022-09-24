import React from "react";
import Error from "../Elements/FieldError";
import Label from "../Elements/FieldLabel";
import { SelectWrapper } from "../styles";

const SelectComponent = ({
  onChange,
  options = [],
  value = "",
  message = "",
  label = "",
  name = "",
  placeholder = "",
  disabled,
}: any) => {
  const error = !!message;
  return (
    <SelectWrapper
      className={`textField ${error ? "isError" : ""} ${
        value ? "isFilled" : ""
      }`}
    >
      {label ? <Label label={label} /> : ""}
      <div className="select-wrapper">
        <select
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
        >
          <option value="" disabled hidden>
            {placeholder}
          </option>
          {options.length
            ? options.map((option: any) => {
                return (
                  <option key={option.id} value={option.value}>
                    {option.label}
                  </option>
                );
              })
            : ""}
        </select>
      </div>
      {message ? <Error message={message} /> : ""}
    </SelectWrapper>
  );
};

export default SelectComponent;
