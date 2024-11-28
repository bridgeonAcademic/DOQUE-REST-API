import type { Request, Response } from "express";
import { Space } from "../models/spaceModel";
import { StandardResponse } from "../utils/standardResponse";
import { CustomError } from "../utils/error/customError";
import Workspace from "../models/workspaceModel";
import mongoose from "mongoose";

//create a new space
export const createSpace = async (req: Request, res: Response) => {
	const { name, description } = req.body;
	const { workspaceId } = req.query;

	if (!workspaceId) {
		throw new CustomError("Workspace ID is required");
	}

	const workspace = await Workspace.findById(workspaceId);

	if (!workspace) {
		throw new CustomError("Workspace not found");
	}

	const newSpace = new Space({
		name,
		description,
		workspaceId,
		lists: [],
	});

	await Promise.all([newSpace.save(), workspace.updateOne({ $push: { spaces: newSpace._id } })]);

	res.status(201).json(new StandardResponse("Space created successfully", newSpace, 201));
};

//get all spaces
export const getAllSpaces = async (req: Request, res: Response) => {
	const { workspaceId } = req.query;

	if (!workspaceId) {
		throw new CustomError("Workspace ID is required");
	}

	const spaces = await Space.aggregate([
		{ $match: { workspaceId: new mongoose.Types.ObjectId(workspaceId as string) } }, // Filter spaces by workspaceId
		{
			$lookup: {
				from: "lists",
				localField: "_id",
				foreignField: "spaceId",
				as: "lists",
			},
		},
		{
			$unwind: {
				path: "$lists",
				preserveNullAndEmptyArrays: true,
			},
		},
		{
			$lookup: {
				from: "tasks",
				localField: "lists._id",
				foreignField: "listId",
				as: "lists.tasks",
			},
		},
		{
			$group: {
				_id: "$_id",
				name: { $first: "$name" },
				description: { $first: "$description" },
				workspaceId: { $first: "$workspaceId" },
				lists: {
					$push: {
						_id: "$lists._id",
						name: "$lists.name",
						tasks: "$lists.tasks",
					},
				},
			},
		},
	]);

	res.status(200).json(new StandardResponse("Spaces fetched successfully", spaces, 200));
};

//get a specific space by id
export const getSpaceById = async (req: Request, res: Response) => {
	const { id } = req.params;

	const space = await Space.aggregate([
		{ $match: { _id: new mongoose.Types.ObjectId(id) } }, // Match the space
		{
			$lookup: {
				from: "lists", // Collection name for lists
				localField: "_id",
				foreignField: "spaceId", // Assuming lists have a `spaceId` field
				as: "lists",
			},
		},
		{
			$lookup: {
				from: "tasks", // Collection name for tasks
				localField: "lists._id",
				foreignField: "listId", // Assuming tasks have a `listId` field
				as: "tasks",
			},
		},
		{
			$addFields: {
				lists: {
					$map: {
						input: "$lists",
						as: "list",
						in: {
							$mergeObjects: [
								"$$list",
								{
									tasks: {
										$filter: {
											input: "$tasks",
											as: "task",
											cond: { $eq: ["$$task.listId", "$$list._id"] },
										},
									},
								},
							],
						},
					},
				},
			},
		},
		{ $project: { tasks: 0 } }, // Remove the top-level tasks array
	]);

	if (!space.length) {
		throw new CustomError("Space not found");
	}

	res.status(200).json(new StandardResponse("Space fetched successfully", space[0], 200));
};

//update a specific space by id
export const updateSpaceById = async (req: Request, res: Response) => {
	const { id } = req.params;
	const { name, description } = req.body;
	const updatedSpace = await Space.findByIdAndUpdate(id, { name, description }, { new: true });
	if (!updatedSpace) {
		throw new CustomError("Space not found");
	}
	res.status(200).json(new StandardResponse("Space updated successfully", updatedSpace, 200));
};

//delete a specific space by id
export const deleteSpaceById = async (req: Request, res: Response) => {
	const { id } = req.params;

	const deletedSpace = await Space.findByIdAndDelete(id);
	if (!deletedSpace) {
		throw new CustomError("Space not found");
	}
	await Workspace.findByIdAndUpdate(deletedSpace.workspaceId, { $pull: { spaces: id } });
	res.status(200).json(new StandardResponse("Space deleted successfully"));
};
