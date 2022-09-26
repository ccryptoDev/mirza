/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/interactive-supports-focus */
import React, { useState } from "react";
import styled from "styled-components";

const Label = styled.label`
  margin-right: 1rem;
`;

const Control = styled.input`
  /* removing default appearance */
  -webkit-appearance: none;
  appearance: none;

  display: inline-block;
  width: 4.4rem;
  height: 2.2rem;

  border-radius: 30px;
  background: var(--color-gray-3);
  transition: all 0.3s ease-in-out;

  cursor: pointer;

  font-size: 40px;
  text-align: center;

  position: relative;

  /* slider thumb */
  &:after {
    position: absolute;
    display: inline-block;
    content: "";
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    top: 1px;
    bottom: 0;
    left: 1px;
    background: white;
    transition: all 0.3s ease-in-out;
    cursor: pointer;
  }

  &.checked:after {
    left: calc(100% - 2.1rem);
  }

  &.checked {
    background: var(--color-green-3);
    transition: all 0.3s ease-in-out;
  }
`;

type ToggleButtonProps = {
  id: string;
  label: string;
  defaultChecked?: boolean;
};

const ToggleButton = ({
  id,
  label,
  defaultChecked,
}: ToggleButtonProps): JSX.Element => {
  const [checked, setChecked] = useState(defaultChecked || false);

  return (
    <span onClick={() => setChecked((prev) => !prev)}>
      <Label htmlFor={id}>{label}</Label>
      <Control
        className={checked ? "checked" : ""}
        type="checkbox"
        id={id}
        checked={checked}
      />
    </span>
  );
};

export default ToggleButton;
