import type { Request, Response } from "express";
import { CustomError } from "../utils/error/customError";
import { StandardResponse } from "../utils/standardResponse";
import { Space } from "../models/spaceModel";
import List from "../models/listModel";

export const createList = async (req: Request, res: Response) => {
	const spaceId = req.params.spaceId;
	const { name, description, color, task } = req.body;

	const space = await Space.findById(spaceId);

	if (!space) {
		throw new CustomError("space not found", 404);
	}

	const newList = new List({
		spaceId,
		name,
		description,
		color,
		task: task || [],
	});

	await Promise.all([newList.save(), space.updateOne({ $push: { lists: newList._id } })]);

	res.status(200).json(new StandardResponse("List Created Successfully", newList, 201));
};

export const getAllLists = async (req: Request, res: Response) => {
	const { spaceId } = req.params;

	const lists = await List.find({ spaceId });

	if (!lists || lists.length === 0) {
		throw new CustomError("No lists found for this space", 404);
	}

	res.status(200).json(new StandardResponse("Lists Retrieved Successfully", lists, 200));
};

export const updateList = async (req: Request, res: Response) => {
	const { spaceId, listId } = req.params;
	const { name, description, color } = req.body;

	try {
		const space = await Space.findById(spaceId);
		if (!space) {
			throw new CustomError("Space not found", 404);
		}

		const list = await List.findOne({ _id: listId, spaceId });
		if (!list) {
			throw new CustomError("List not found in the specified space", 404);
		}

		if (name) list.name = name;
		if (description) list.description = description;
		if (color) list.color = color;

		await list.save();

		res.status(200).json(new StandardResponse("List Updated Successfully", list, 200));
	} catch (error) {
		const errorMessage = (error as Error).message || "Unknown error";
		res.status(500).json(new CustomError("Failed to update list", 500, errorMessage));
	}
};

export const deleteList = async (req: Request, res: Response) => {
	const { spaceId, listId } = req.params;

	try {
		const space = await Space.findById(spaceId);

		if (!space) {
			throw new CustomError("Space not found", 404);
		}

		const list = await List.findOne({ _id: listId, spaceId });
		if (!list) {
			throw new CustomError("List not found in the specified space", 404);
		}

		await Promise.all([list.deleteOne(), space.updateOne({ $pull: { lists: listId } })]);

		res.status(200).json(new StandardResponse("List Deleted Successfully", null, 200));
	} catch (error) {
		const errorMessage = (error as Error).message || "Unknown error";
		res.status(500).json(new CustomError("Failed to delete list", 500, errorMessage));
	}
};
