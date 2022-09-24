import React from "react";
import moment from "moment";
import { DatePickerWrapper } from "../styles";
import Label from "../Elements/FieldLabel";
import Error from "../Elements/FieldError";
import DatePicker from "./Material";

export default function DobPicker({
  label = "",
  onChange,
  message = "",
  name,
  value = new Date(),
}: any) {
  const onChangeHandler = (e: any) => {
    const date = new Date(e.target.value);
    const event = { target: { value: date, name } };
    onChange(event);
  };
  const error = !!message;
  return (
    <DatePickerWrapper
      className={`textField ${error ? "isError" : ""} ${
        value ? "isFilled" : ""
      }`}
    >
      {label ? <Label label={label} /> : ""}
      <div style={{ position: "relative" }}>
        <DatePicker
          value={moment(value).format("YYYY-MM-DD")}
          name={name}
          onChange={onChangeHandler}
        />
      </div>
      <Error message={message} />
    </DatePickerWrapper>
  );
}
