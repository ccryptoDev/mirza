export const validate = (form) => {
  const newForm = { ...form };
  let isValid = true;

  if (!form.income.value) {
    isValid = false;
    newForm.income.message = "Enter your income amount";
  }

  if (!form.agree.value) {
    isValid = false;
    newForm.agree.message =
      "You need to confirm that your information is correct";
  }

  return [isValid, newForm];
};
