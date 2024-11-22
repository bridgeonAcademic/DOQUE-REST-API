import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { CustomError } from "../../utils/error/customError";
import { StandardResponse } from "../../utils/standardResponse";

export const adminLogin = async (req: Request, res: Response) => {
	const { email, password } = req.body;

	const ADMIN_KEY = process.env.ADMIN_KEY || "";
	const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "";

	if (email !== ADMIN_KEY) {
		throw new CustomError("Admin not found", 400);
	}

	const isPasswordCorrect = await bcrypt.compare(password, ADMIN_PASSWORD);
	if (!isPasswordCorrect) {
		throw new CustomError("Invalid admin credentials", 400);
	}

	const token = jwt.sign(
		{
			role: "admin",
		},
		process.env.JWT_SECRET_KEY || "",
		{
			expiresIn: "1d",
		},
	);

	res.status(200).json(new StandardResponse(token));
};
