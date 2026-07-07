import { validationResult } from "express-validator";

const validateRequest = (req, _res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error(errors.array().map((item) => item.msg).join(", "));
    error.statusCode = 422;
    throw error;
  }

  next();
};

export default validateRequest;

