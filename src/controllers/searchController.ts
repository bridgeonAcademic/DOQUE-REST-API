import type { Request, Response } from "express";
import { CustomError } from "../utils/error/customError";
import { StandardResponse } from "../utils/standardResponse";
import Workspace from "../models/workspaceModel";

export const searchWorkspace = async (req: Request, res: Response) => {
	const { query } = req.query;

	if (!query || typeof query !== "string") {
		throw new CustomError("Query parameter is required and should be a string", 400);
	}
	const workspaces = await Workspace.aggregate([
		{
			$match: {
				name: { $regex: query, $options: "i" },
			},
		},
	]);

	if (!workspaces || workspaces.length === 0) {
		throw new CustomError("Workspace not found", 404);
	}

	res.status(200).json(new StandardResponse("Workspaces retrieved successfully", workspaces));
};
