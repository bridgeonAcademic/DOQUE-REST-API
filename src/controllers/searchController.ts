import type { Response } from "express";
import { CustomError } from "../utils/error/customError";
import { StandardResponse } from "../utils/standardResponse";
import Workspace from "../models/workspaceModel";
import type { CustomRequest } from "../types/interfaces";
import mongoose from "mongoose";

export const searchWorkspace = async (req: CustomRequest, res: Response) => {
	const userId = req.user?.id;
	const { query } = req.query;

	if (!query || typeof query !== "string") {
		throw new CustomError("Query parameter is required and should be a string", 400);
	}

	const workspaces = await Workspace.aggregate([
		{
			$match: {
				name: { $regex: query, $options: "i" },
				members: { $in: [new mongoose.Types.ObjectId(userId)] },
			},
		},
	]);

	if (!workspaces || workspaces.length === 0) {
		throw new CustomError("Workspace not found", 404);
	}

	res.status(200).json(new StandardResponse("Workspaces retrieved successfully", workspaces));
};
