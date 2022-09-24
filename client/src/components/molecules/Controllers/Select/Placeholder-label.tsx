import React from "react";
import Error from "../Elements/FieldError";
import Label from "../Elements/FieldLabel";
import { DynamicLabelSelect } from "../styles";

const SelectComponent = ({
  onChange,
  options = [],
  value = "",
  message = "",
  label = "",
  name = "",
}: any) => {
  const error = !!message;
  return (
    <DynamicLabelSelect
      className={`textField ${
        error ? "isError" : ""
      } textField-placeholder-label ${value ? "isFilled" : ""}`}
    >
      <div className="input-wrapper">
        <select name={name} value={value} onChange={onChange}>
          {options.length ? (
            options.map((option: any) => {
              return (
                <option key={option.id} value={option.value}>
                  {option.label}
                </option>
              );
            })
          ) : (
            <option value=""> </option>
          )}
        </select>
        {label ? <Label label={label} /> : ""}
      </div>
      {message ? <Error message={message} /> : ""}
    </DynamicLabelSelect>
  );
};

export default SelectComponent;
