import type { Request, Response } from "express";
import { User } from "../models/userModel";
import { StandardResponse } from "../utils/standardResponse";
import { CustomError } from "../utils/error/customError";

export const getAllUsers = async (_req: Request, res: Response) => {
	const users = await User.find();

	if (!users) {
		throw new CustomError("User not found");
	}

	res.status(200).json(new StandardResponse("Retrive All users successfully", users));
};

export const getUserById = async (_req: Request, res: Response) => {
	const userId = "67333b625473e0b773d951cc";
	const user = await User.findById(userId);

	if (!user) {
		throw new CustomError("User not found");
	}

	res.status(200).json(new StandardResponse("Space deleted successfully", user));
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
