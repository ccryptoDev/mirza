export const validate = (form) => {
  const newForm = { ...form };
  let isValid = true;

  if (!form.requestedAmount.value) {
    isValid = false;
    newForm.requestedAmount.message = "Enter amount";
  }

  return [isValid, newForm];
};
