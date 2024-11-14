import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { CustomRequest } from "../types/interfaces";
import { CustomError } from "../utils/error/customError";

export const verifyToken = (req: Request, _res: Response, next: NextFunction) => {
	const token = req.header("Authorization")?.split(" ")[1];
	if (!token) {
		throw new CustomError("Not authenticated", 401);
	}
	try {
		const verified = jwt.verify(token, process.env.JWT_SECRET_KEY || "");
		(req as CustomRequest).user = verified;
		next();
	} catch (_err) {
		throw new CustomError("Invalid token", 401);
	}
};
