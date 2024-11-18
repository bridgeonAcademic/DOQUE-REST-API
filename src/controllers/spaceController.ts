import type { Request, Response } from "express";
import { Space } from "../models/spaceModel";
import { StandardResponse } from "../utils/standardResponse";
import { CustomError } from "../utils/error/customError";

//create a new space
export const createSpace = async (req: Request, res: Response) => {
	const { name, description } = req.body;
	const { workspaceId } = req.query;

	const newSpace = new Space({
		name,
		description,
		workspaceId,
		lists: [],
	});

	await newSpace.save();

	res.status(201).json(new StandardResponse("Space created successfully", newSpace, 201));
};

//get all spaces
export const getAllSpaces = async (req: Request, res: Response) => {
	const { workspaceId } = req.query;
	if (!workspaceId) {
		throw new CustomError("Workspace ID is required");
	}

	const spaces = await Space.find({ workspaceId });
	res.status(200).json(new StandardResponse("Spaces fetched successfully", spaces, 200));
};

//get a specific space by id
export const getSpaceById = async (req: Request, res: Response) => {
	const { id } = req.params;
	const space = await Space.findById(id);
	if (!space) {
		throw new CustomError("Space not found");
	}
	res.status(200).json(new StandardResponse("Space fetched successfully", space, 200));
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
	res.status(200).json(new StandardResponse("Space deleted successfully", deletedSpace, 200));
};
