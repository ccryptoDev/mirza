export const validate = (form) => {
  const newForm = { ...form };
  let isValid = true;

  if (!form.income.value) {
    isValid = false;
    newForm.income.message = "Enter your income amount";
  }

  return [isValid, newForm];
};
