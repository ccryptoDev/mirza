import React from "react";
import styled, { css } from "styled-components";
import { ReactComponent as CheckMark } from "./tick-thick.svg";
import Error from "../Elements/FieldError";

const error = css`
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 5px;
`;

const checkbox = css`
  .checkboxField {
    display: flex;
    align-items: flex-start;
  }

  &.text-center .checkboxField {
    align-items: center;
  }

  /* Hide the browser's default checkbox */
  & input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }

  /* Create a custom checkbox */
  .checkmark-box {
    display: block;
    position: relative;
    height: 32px;
    min-height: 32px;
    width: 32px;
    max-width: 32px;
    padding: 7px;
    margin-right: 10px;
    border-radius: 3px;
    background-color: #fff;
    border: 2px solid var(--color-gray-2);
    box-sizing: border-box;
  }

  /* On mouse-over, add a grey background color */
  &:hover input ~ .checkmark-box {
    background-color: var(--color-purple-1);
    border-color: var(--color-purple-4);
  }

  /* When the checkbox is checked, add background color */
  & input:checked ~ .checkmark-box {
    background-color: var(--color-purple-4);
    border-color: var(--color-purple-4);
  }

  /* Create the checkmark/indicator (hidden when not checked) */
  .checkmark-box .checkmark {
    content: "";
    position: absolute;
    display: none;
  }

  /* Show the checkmark when checked */
  & input:checked ~ .checkmark-box .checkmark {
    display: block;
  }

  & input:disabled ~ .checkmark-box {
    opacity: 0.5;
  }

  /* Style the checkmark/indicator */
  & .checkmark-box .checkmark {
    transform: translate(-50%, -50%);
    left: 50%;
    top: 50%;
    & path {
      fill: #fff;
    }
  }
`;

const Wrapper = styled.label`
  display: block;
  position: relative;
  cursor: pointer;
  font-size: inherit;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  color: inherit;
  text-transform: initial;
  font-weight: normal;

  ${checkbox}

  & .error {
    ${error}
  }
`;

const CheckBoxContainer = ({
  value = false,
  name,
  label,
  onChange,
  className,
  disabled = false,
  message,
}: any) => {
  return (
    <Wrapper className={className}>
      <div className="checkboxField">
        <input
          type="checkbox"
          name={name}
          disabled={disabled}
          checked={value}
          onChange={(e) =>
            onChange({
              target: { value: e.target.checked, name: e.target.name },
            })
          }
        />
        <span className="checkmark-box">
          <CheckMark className="checkmark" />
        </span>
        <div>{label}</div>
      </div>
      <Error message={message} />
    </Wrapper>
  );
};

export default CheckBoxContainer;
