import type { Response } from "express";
import { User } from "../../models/userModel";
import { CustomError } from "../../utils/error/customError";
import { StandardResponse } from "../../utils/standardResponse";
import type { CustomRequest } from "../../types/interfaces";
import Workspace from "../../models/workspaceModel";
import mongoose from "mongoose";

export const getAllUsers = async (req: CustomRequest, res: Response) => {
	if (!req.user) {
		throw new CustomError("Unauthorized access", 401);
	}

	const users = await User.find().select("-password");

	res.status(200).json(new StandardResponse("Users retrieved successfully", users));
};

export const blockUser = async (req: CustomRequest, res: Response) => {
	const { userId } = req.params;
	const { isBlocked } = req.query;
	console.log("param", userId);

	if (isBlocked !== "true" && isBlocked !== "false") {
		throw new CustomError("Invalid query parameter for 'isBlocked'", 400);
	}

	const user = await User.findById(userId);
	console.log("find", user);

	if (!user) {
		throw new CustomError("User not found", 404);
	}

	user.isBlocked = isBlocked === "true";

	await user.save();

	res
		.status(200)
		.json(new StandardResponse(`User ${isBlocked === "true" ? "blocked" : "unblocked"} successfully`, user));
};

export const getAllWorkspacesWithSpaces = async (req: CustomRequest, res: Response) => {
	if (!req.user) {
		throw new CustomError("Unauthorized access", 401);
	}

	const workspacesWithSpaces = await Workspace.aggregate([
		{
			$lookup: {
				from: "spaces",
				localField: "_id",
				foreignField: "workspaceId",
				as: "spaces",
			},
		},
	]);

	res.status(200).json(new StandardResponse("Workspaces with spaces retrieved successfully", workspacesWithSpaces));
};

export const getWorkspaceById = async (req: CustomRequest, res: Response) => {
	const { workspaceId } = req.params;

	if (!req.user) {
		throw new CustomError("Unauthorized access", 401);
	}
	const workspaceWithSpaces = await Workspace.aggregate([
		{
			$match: { _id: new mongoose.Types.ObjectId(workspaceId) },
		},
		{
			$lookup: {
				from: "spaces",
				localField: "_id",
				foreignField: "workspaceId",
				as: "spaces",
			},
		},
	]);

	if (!workspaceWithSpaces.length) {
		throw new CustomError("Workspace not found", 404);
	}

	res.status(200).json(new StandardResponse("Workspace with spaces retrieved successfully", workspaceWithSpaces[0]));
};
