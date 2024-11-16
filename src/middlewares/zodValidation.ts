import type { Request, Response, NextFunction } from "express";
import { type AnyZodObject, ZodError } from "zod";
import { CustomError } from "../utils/error/customError";

export function validateData(schema: AnyZodObject) {
	return (req: Request, _res: Response, next: NextFunction) => {
		try {
			schema.parse(req.body);
			next();
		} catch (error) {
			if (error instanceof ZodError) {
				throw new CustomError(`Invalid data, ${error.errors[0].path}: ${error.errors[0].message}`, 400);
			}
			throw new CustomError("Error when validating data", 400);
		}
	};
}
