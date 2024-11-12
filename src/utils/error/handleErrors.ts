import type { CastError } from "mongoose";
import { CustomError } from "./customError";

const castErrorHandler = (err: CastError) => {
  // cast error means that the value is not of the correct type defined in the schema
  const msg = `Invalid value for ${err.path}: ${err.value}!`;
  return new CustomError(msg, 400);
};

const duplicateKeyErrorHandler = (err: {
  keyValue: Record<string, string>;
}) => {
  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];

  return new CustomError(`${value} already exists!`, 400);
};

const validationErrorHandler = (err: {
  errors: { [key: string]: { message: string } };
}) => {
  const errors = Object.values(err.errors).map((val) => val.message);
  const errorMessages = errors.join(". ");
  const msg = `Invalid input data: ${errorMessages}`;

  return new CustomError(msg, 400);
};

export { castErrorHandler, duplicateKeyErrorHandler, validationErrorHandler };
