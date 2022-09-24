import { validateEmail } from "../../../../../utils/validators/email";
import { validatePassword } from "../../../../../utils/validators/password";

export const validate = (form) => {
  const newForm = { ...form };
  let isValid = true;

  if (!validateEmail(newForm?.email?.value)) {
    isValid = false;
    newForm.email.message = "enter a valid email";
  }

  const [isPasswordValid, passwordMessage] = validatePassword({
    password: newForm.password.value,
  });
  if (!isPasswordValid) {
    isValid = false;
    if (passwordMessage) newForm.password.message = passwordMessage;
    else newForm.password.message = "enter a valid password";
  }
  return [isValid, newForm];
};
