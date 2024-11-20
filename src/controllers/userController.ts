import type { Request, Response } from "express";
import { User } from "../models/userModel";
import { StandardResponse } from "../utils/standardResponse";
import { CustomError } from "../utils/error/customError";
import type { CustomRequest } from "../types/interfaces";

export const getUserById = async (req: CustomRequest, res: Response) => {
	const userId = req.user?.id;
	const user = await User.findById(userId);

	if (!user) {
		throw new CustomError("User not found");
	}

	res.status(200).json(new StandardResponse("Profile fetched successfully", user));
};

export const updatedUserProfile = async (req: Request, res: Response) => {
	const userId = req.params.userId;
	const { firstName, lastName, phoneNumber, image } = req.body;

	const user = await User.findById(userId);

	if (!user) {
		throw new CustomError("User not found");
	}

	const updatedProfile = await User.findByIdAndUpdate(
		userId,
		{ firstName, lastName, phoneNumber, image },
		{ new: true },
	);

	res.status(200).json(new StandardResponse("User Updated successfully", updatedProfile));
};
