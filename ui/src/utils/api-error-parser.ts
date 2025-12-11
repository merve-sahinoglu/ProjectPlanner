import { ResponseErrorArrayDto } from '@helpers/request-handler/response-base';

const parseResponseErrors = (errors: ResponseErrorArrayDto) => {
  let validationError = Object.values(errors).toString();
  validationError = validationError.replace(',', '\n');

  return validationError;
};

export default parseResponseErrors;