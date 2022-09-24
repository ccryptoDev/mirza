import React from "react";
import TextField from "@material-ui/core/TextField";

export default function DatePickers({
  label,
  value,
  name,
  onChange,
  placeholder,
}: any) {
  return (
    <TextField
      id="date"
      label={label}
      type="date"
      name={name}
      onChange={onChange}
      defaultValue={value}
      placeholder={placeholder}
      InputLabelProps={{
        shrink: true,
      }}
    />
  );
}
