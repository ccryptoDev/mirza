import { passwordRegexp } from "../regexp";

export const validatePassword = ({
  password,
  rePassword,
}: {
  password: string;
  rePassword?: string;
}) => {
  let isValid = true;
  let passwordMessage = "";
  let rePasswordMessage = "";

  // check if the password matches the format
  if (passwordRegexp.test(password)) {
    // check if the passwords match if there is repassword field
    if (rePassword !== undefined && rePassword !== password) {
      isValid = false;
      rePasswordMessage = "passwords should match";
    }
    passwordMessage = "";
  } else {
    isValid = false;
    passwordMessage =
      "Minimum 8 characters, at least 1 letter, 1 number and 1 special character";
  }

  return [isValid, passwordMessage, rePasswordMessage];
};
