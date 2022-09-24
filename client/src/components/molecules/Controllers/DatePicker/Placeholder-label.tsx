import React from "react";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import Error from "../Elements/FieldError";
import { DynamicLabelDatePicker } from "../styles";

const InputField = ({
  value = "",
  label = "",
  disabled = false,
  message = "",
  onChange,
  name = "field",
}: any) => {
  const onChangeHandler = (e: any) => {
    const event = { target: { value: e, name } };
    onChange(event);
  };
  const error = !!message;
  return (
    <DynamicLabelDatePicker
      className={`textField ${
        error ? "isError" : ""
      } textField-placeholder-label ${value ? "isFilled" : ""}`}
    >
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DesktopDatePicker
          label={label}
          disabled={disabled}
          inputFormat="MM/dd/yyyy"
          value={value}
          onChange={onChangeHandler}
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>

      <Error message={message} />
    </DynamicLabelDatePicker>
  );
};

export default InputField;
