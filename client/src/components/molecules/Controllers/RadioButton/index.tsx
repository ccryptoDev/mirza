/*eslint-disable*/
import React from "react";
import { Root, Fill, Input, Wrapper, RadioGroupWrapper } from "./styles";

export const Radio = ({ name, label, value, onChange, selected }: any) => {
  const checked = selected === value;
  return (
    <label>
      <Wrapper>
        <Root>
          <Input
            type="radio"
            name={name}
            value={value}
            checked={checked}
            onChange={onChange}
          />
          <Fill />
        </Root>
        <span className="checkbox-label">{label}</span>
      </Wrapper>
    </label>
  );
};

const RadioGroup = ({ options, onChange, currentSelection, name }: any) => {
  return (
    <RadioGroupWrapper>
      {options.map((opt: any) => {
        return (
          <Radio
            key={opt.id}
            name={opt.id}
            selected={currentSelection}
            label={opt.label}
            value={opt.value}
            onChange={(e: any) =>
              onChange({ target: { value: e.target.value, name } })
            }
          />
        );
      })}
    </RadioGroupWrapper>
  );
};

export default RadioGroup;
