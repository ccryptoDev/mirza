import { emailRegexp } from "../regexp";

export const validateEmail = (email) => {
  return emailRegexp.test(String(email).toLowerCase());
};
