import EmailField from "./EmailField";
import Password from "../../../../molecules/Controllers/Password/Placeholder-label";

export const initForm = () => {
  return {
    password: { value: "", message: "" },
    email: { value: "", message: "" },
  };
};

export const renderFields = (form) => [
  {
    value: form.email.value,
    message: form.email.message,
    name: "email",
    component: EmailField,
    label: "Enter Email",
  },
  {
    value: form.password.value,
    message: form.password.message,
    name: "password",
    component: Password,
    label: "Password",
  },
];
