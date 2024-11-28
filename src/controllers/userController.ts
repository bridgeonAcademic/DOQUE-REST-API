import type { Request, Response } from "express";
import { User } from "../models/userModel";
import { StandardResponse } from "../utils/standardResponse";
import { CustomError } from "../utils/error/customError";
import type { CustomRequest } from "../types/interfaces";
import Task from "../models/taskModel";

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

export const taskAssignedToUser = async (req: Request, res: Response) => {
	const { userId } = req.params;

	if (!userId) {
		throw new CustomError("User ID is required", 400);
	}

	try {
		const tasks = await Task.find({ assignedTo: userId });

		if (!tasks || tasks.length === 0) {
			throw new CustomError("No tasks found for the specified user", 404);
		}

		const tasksWithDetails = await Task.aggregate([
			{
				$match: {
					_id: { $in: tasks.map((task) => task._id) },
				},
			},
			{
				$lookup: {
					from: "lists",
					localField: "listId",
					foreignField: "_id",
					as: "listDetails",
				},
			},
			{ $unwind: "$listDetails" },
			{
				$lookup: {
					from: "spaces",
					localField: "listDetails.spaceId",
					foreignField: "_id",
					as: "spaceDetails",
				},
			},
			{ $unwind: "$spaceDetails" },
			{
				$project: {
					_id: 0,
					task: {
						id: "$_id",
						name: "$title",
						priority: "$priority",
						dueDate: "$dueDate",
					},
					list: {
						id: "$listDetails._id",
						name: "$listDetails.name",
					},
					space: {
						id: "$spaceDetails._id",
						name: "$spaceDetails.name",
					},
				},
			},
		]);

		if (!tasksWithDetails || tasksWithDetails.length === 0) {
			throw new CustomError("No tasks found with list and space details", 404);
		}

		res.status(200).json(new StandardResponse("Tasks assigned to the user retrieved successfully", tasksWithDetails));
	} catch (error) {
		throw new CustomError("Internal server error", 500);
	}
};

export const getAllUsers = async (req: Request, res: Response) => {
	const users = await User.find();

	if (!users || users.length < 1) {
		throw new CustomError("Users not found");
	}

	res.status(200).json(new StandardResponse("User fetched successfully", users));
};
