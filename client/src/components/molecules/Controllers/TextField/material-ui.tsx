import React from "react";
import styled from "styled-components";
import TextField from "@mui/material/TextField";

const Wrapper = styled.div`
  margin-bottom: 10px;
  .MuiTextField-root,
  .MuiOutlinedInput-root,
  input {
    width: 100%;
  }
  & input {
    padding: 20px 16px;
    font-size: 16px;
  }

  & label {
    font-size: 16px;
    background: #fff;
    padding: 2px 4px;
  }
`;
export default function BasicTextFields({
  label,
  variant = "outlined",
  name,
  onChange,
}: any) {
  return (
    <Wrapper className="mui-field-wrapper">
      <TextField
        name={name}
        id="outlined-basic"
        label={label}
        variant={variant}
        onChange={onChange}
      />
    </Wrapper>
  );
}
