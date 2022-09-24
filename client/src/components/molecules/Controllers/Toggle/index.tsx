import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  background: transparent;
  border-radius: 11px;
  padding: 5px;
  border: 2px solid var(--color-gray-2);
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 5px;
  width: 42px;
  height: 22px;
  position: relative;
  input {
    width: 100%;
    position: absolute;
    height: 100%;
    opacity: 0;
    cursor: pointer;
  }

  .thumb {
    content: "";
    position: absolute;
    width: 12px;
    height: 12px;
    top: 50%;
    transform: translate(0%, -50%);
    background: var(--color-gray-2);
    left: 3px;
    transition: all 0.2s;
    border-radius: 50%;
  }

  &.active {
    border-color: var(--color-purple-4);
    & .thumb {
      left: calc(100% - 3px);
      transform: translate(-100%, -50%);
      background: var(--color-purple-4);
    }
  }
`;

const Toggle = ({ disabled, name, value = false, onChange }: any) => {
  return (
    <Wrapper className={value ? "active" : ""}>
      <div className="thumb" />
      <input
        type="checkbox"
        disabled={disabled}
        name={name}
        checked={value}
        onChange={(e) =>
          onChange({
            target: { value: e.target.checked, name: e.target.name },
          })
        }
      />
    </Wrapper>
  );
};

export default Toggle;
