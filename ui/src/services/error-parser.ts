const parseResponseErrors = (errors: { [key: string]: Array<string> }) => {
  let validationError = Object.values(errors).toString();
  validationError = validationError.replace(",", "\n");

  return validationError;
};

export default parseResponseErrors;
