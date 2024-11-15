import type { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { CustomRequest, JwtDecoded } from "../../types/interfaces";
import { CustomError } from "../../utils/error/customError";

export const adminAuthenticate = (req: CustomRequest, res: Response, next: NextFunction): void => {
	const token = req.headers.authorization?.split(" ")[1];

	if (!token) {
		res.status(401).json({ message: "Authorization token is missing" });
		return;
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY || "") as JwtDecoded;

		if (decoded.role !== "admin") {
			throw new CustomError("Access denied. Admins only.", 403);
		}

		req.user = decoded;

		next();
	} catch (error) {
		next(error);
	}
};
