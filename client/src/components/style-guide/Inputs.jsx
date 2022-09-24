import React, { useState } from "react";
import styled from "styled-components";
import TextField from "../molecules/Controllers/TextField";
import DatePicker from "../molecules/Controllers/DatePicker";
import Checkbox from "../molecules/Controllers/CheckBox/Custom";
import RadioGroup from "../molecules/Controllers/RadioButton";
import Select from "../molecules/Controllers/Select";
import Toggle from "../molecules/Controllers/Toggle";
import Password from "../molecules/Controllers/Password";
import Search from "../molecules/Controllers/Search/Debounce";

const Wrapper = styled.div`
  padding: 40px;
  section {
    display: flex;
    align-items: end;
    column-gap: 20px;
    margin-bottom: 20px;

    &.column {
      flex-direction: column;
    }
  }
`;

const radioOptions = [
  { id: "0", value: "0", label: "" },
  { id: "1", value: "1", label: "button option 1" },
  { id: "2", value: "2", label: "button option 2" },
  { id: "3", value: "3", label: "button option 3" },
  { id: "4", value: "4", label: "button option 4" },
];

const Guide = () => {
  const [form, setForm] = useState({
    input: { value: "", message: "" },
    checkbox: { value: false, message: "" },
    toggler: { value: false, message: "" },
    radio: { value: "", message: "" },
  });
  const [query, setQuery] = useState("");

  const onChange = (e) => {
    const { value, name } = e.target;
    setForm((prevState) => ({ ...prevState, [name]: { value, message: "" } }));
  };

  const onSearchHandler = (value) => {
    setQuery(value);
  };

  return (
    <Wrapper>
      <section>
        <TextField
          value={form.input.value}
          name="input"
          message={form.input.message}
          onChange={onChange}
          label="Text field"
        />
        <Password
          value={form.input.value}
          name="input"
          message={form.input.message}
          onChange={onChange}
          label="Password field"
        />
        <Select
          value={form.radio.value}
          name="radio"
          message={form.radio.message}
          onChange={onChange}
          label="Select field"
          options={radioOptions}
        />
        <DatePicker
          value={form.input.value}
          name="input"
          message={form.input.message}
          onChange={onChange}
          label="Date"
        />
        <Search searchHandler={onSearchHandler} />
      </section>
      <section>{query}</section>
      <section>
        <Checkbox
          value={form.checkbox.value}
          name="checkbox"
          message={form.checkbox.message}
          onChange={onChange}
          label="Checkbox element label"
        />
        <Toggle
          value={form.toggler.value}
          name="toggler"
          message={form.toggler.message}
          onChange={onChange}
        />
      </section>
      <section>
        <RadioGroup
          options={radioOptions}
          currentSelection={form.radio.value}
          onChange={onChange}
          name="radio"
        />
      </section>
    </Wrapper>
  );
};

export default Guide;
