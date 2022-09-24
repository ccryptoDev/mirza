import React from "react";
import styled from "styled-components";

const Wrapper = styled.label`
  .checkbox-wrapper {
    cursor: pointer;
    display: flex;
    align-items: center;
  }

  input {
    margin-right: 5px;
    cursor: pointer;
  }
`;

const Error = styled.div`
  color: red;
  margin-left: 18px;
`;


const CheckBoxContainer = ({
  value = false,
  message,
  name,
  label,
  onChange,
  className,
  disabled,
}: any) => {
  const onChangeHandler = (e: any) => {
    onChange({ target: { value: e.target.checked, name: e.target.name } });
  };
  return (
    <Wrapper className={`checkbox ${className}`}>
      <div className="checkbox-wrapper">
        <input
          type="checkbox"
          name={name}
          disabled={disabled}
          checked={value}
          onChange={onChangeHandler}
        />
        <span className="label">{label}</span>
      </div>
      {message ? <Error className="error">{message}</Error> : ""}
    </Wrapper>
  );
};

export default CheckBoxContainer;
