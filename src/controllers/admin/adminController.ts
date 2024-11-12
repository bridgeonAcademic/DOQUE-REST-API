import type { Response } from "express";
import { User } from "../../models/userModel";
import { CustomError } from "../../utils/error/customError";
import { StandardResponse } from "../../utils/standardResponse";
import type { CustomRequest } from "../../types/interfaces";

export const getAllUsers = async (req: CustomRequest, res: Response) => {
	if (!req.user) {
		throw new CustomError("Unauthorized access", 401);
	}

	const users = await User.find().select("-password");

	res.status(200).json(new StandardResponse("Users retrieved successfully", users));
};
