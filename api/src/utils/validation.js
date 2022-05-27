import { validationResult } from 'express-validator';
const ValidationFormatter = (err) => {
  let errorObject = {};
  for (const key in err) {
    if (err.hasOwnProperty(key)) {
      const e = err[key];
      errorObject[e.param] = e.msg;
    }
  }
  return errorObject;
};
const CheckValidation = (req) => {
  return validationResult(req);
};

/**
 *
 */

export { ValidationFormatter, CheckValidation };
