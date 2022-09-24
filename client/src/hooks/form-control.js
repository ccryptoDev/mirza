import { useState } from "react";

export const useForm = ({ initForm }) => {
  if (typeof initForm !== "function")
    throw new Error("initForm is not a function");

  const [form, setForm] = useState(initForm());

  const onChangeHandler = (e) => {
    const { value, name } = e.target;
    setForm((prevState) => ({
      ...prevState,
      [name]: { value, message: "" },
    }));
  };

  return { form, setForm, onChangeHandler };
};
