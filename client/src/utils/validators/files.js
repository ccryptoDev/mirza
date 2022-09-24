export const validateFiles = (form) => {
  const updatedForm = { ...form };
  let isValid = true;
  Object.keys(updatedForm).forEach((key) => {
    const uploadedNumberOfDocuments = updatedForm[key].value.length;
    const requiredNumberOfDocuments = updatedForm[key].limit;
    const isRequired = updatedForm[key].required;
    if (isRequired && uploadedNumberOfDocuments !== requiredNumberOfDocuments) {
      isValid = false;
      updatedForm[
        key
      ].message = `documents missing (${uploadedNumberOfDocuments}/${requiredNumberOfDocuments})`;
    }
  });

  return [isValid, updatedForm];
};
