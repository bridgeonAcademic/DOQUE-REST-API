import type { Response } from "express";
import { User } from "../../models/userModel";
import { CustomError } from "../../utils/error/customError";
import { StandardResponse } from "../../utils/standardResponse";
import type { CustomRequest } from "../../types/interfaces";
import Workspace from "../../models/workspaceModel";
import mongoose from "mongoose";
import { PaymentModel } from "../../models/paymentModel";

export const getAllUsers = async (req: CustomRequest, res: Response) => {
	if (!req.user) {
		throw new CustomError("Unauthorized access", 401);
	}

	const users = await User.find().select("-password");

	const usersWithActiveWorkspaces = await Promise.all(
		users.map(async (user) => {
			const activeWorkspaces = await Workspace.find({
				members: { $in: [user._id] },
			});

			return {
				...user.toObject(),
				activeWorkspaces,
			};
		}),
	);

	res
		.status(200)
		.json(new StandardResponse("Users with active workspaces retrieved successfully", usersWithActiveWorkspaces));
};

export const blockUser = async (req: CustomRequest, res: Response) => {
	const { userId } = req.params;
	const { action } = req.query;

	if (action !== "block" && action !== "unblock") {
		throw new CustomError("Invalid query parameter for 'action'", 400);
	}

	const user = await User.findById(userId);

	if (!user) {
		throw new CustomError("User not found", 404);
	}

	user.isBlocked = action === "block";

	await user.save();

	res.status(200).json(new StandardResponse(`User ${action === "block" ? "blocked" : "unblocked"} successfully`, user));
};

export const getAllWorkspacesWithSpaces = async (req: CustomRequest, res: Response) => {
	if (!req.user) {
		throw new CustomError("Unauthorized access", 401);
	}

	const { page = 1, limit = 10 } = req.query;

	const skip = (Number(page) - 1) * Number(limit);

	const workspacesWithSpaces = await Workspace.aggregate([
		{
			$lookup: {
				from: "spaces",
				localField: "_id",
				foreignField: "workspaceId",
				as: "spaces",
			},
		},
		{
			$facet: {
				data: [{ $skip: skip }, { $limit: Number(limit) }],
				totalCount: [{ $count: "count" }],
			},
		},
	]);

	const total = workspacesWithSpaces[0]?.totalCount[0]?.count || 0;

	res.status(200).json(
		new StandardResponse("Workspaces with spaces retrieved successfully", {
			data: workspacesWithSpaces[0]?.data || [],
			total,
			page: Number(page),
			limit: Number(limit),
		}),
	);
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
		{
			$lookup: {
				from: "users",
				localField: "members",
				foreignField: "_id",
				as: "members",
				pipeline: [
					{
						$project: {
							password: 0,
							__v: 0,
						},
					},
				],
			},
		},
		{
			$lookup: {
				from: "users",
				localField: "pendingMembers",
				foreignField: "_id",
				as: "pendingMembers",
				pipeline: [
					{
						$project: {
							password: 0,
							__v: 0,
						},
					},
				],
			},
		},
	]);

	if (!workspaceWithSpaces.length) {
		throw new CustomError("Workspace not found", 404);
	}

	res.status(200).json(new StandardResponse("Workspace with spaces retrieved successfully", workspaceWithSpaces[0]));
};

export const getAllSubscription = async (req: CustomRequest, res: Response) => {
	if (!req.user) {
		throw new CustomError("Unauthorized access", 401);
	}

	const subscription = await PaymentModel.find();

	if (!subscription.length) {
		throw new CustomError("No subscription found", 404);
	}
	res.status(200).json(new StandardResponse("Subscription retrieved successfully", subscription));
};
