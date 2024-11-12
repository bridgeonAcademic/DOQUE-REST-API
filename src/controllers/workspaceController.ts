import type { Request, Response } from "express";
import Workspace from "../models/workspaceModel";
import { StandardResponse } from "../utils/standardResponse";
import { CustomError } from "../utils/error/customError";
import Space from "../models/spaceModel";

export const createWorkspace = async (req: Request, res: Response) => {
	const { name, description, visibility } = req.body;
	const userId = "6732db6df4f87f43bffbd31e";
	const workspace = new Workspace({
		name,
		description,
		visibility,
		members: [{ userId: userId, status: "owner" }],
		createdBy: userId,
	});

	await workspace.save();

	res.status(201).json(new StandardResponse("workspace created successfully", workspace));
};

export const getActiveWorkspace = async (_req: Request, res: Response) => {
	const userId = "6732db6df4f87f43bffbd31e";

	const workspace = await Workspace.find({ createdBy: userId });

	if (!workspace) {
		throw new CustomError("No active workspace", 404);
	}

	res.status(200).json(new StandardResponse("fetched active workspace successfully", workspace));
};

export const getWorkspaceById = async (req: Request, res: Response) => {
	const { id } = req.params;

	const workspace = await Workspace.findById(id);

	if (!workspace) {
		throw new CustomError("No active workspace", 404);
	}

	res.status(200).json(new StandardResponse("fetched workspace successfully", workspace));
};

export const updateWorkspace = async (req: Request, res: Response) => {
	const { id } = req.params;
	const updateWorkspace = req.body;

	const workspace = await Workspace.findByIdAndUpdate(id, { $set: updateWorkspace }, { new: true });

	if (!workspace) {
		throw new CustomError("Workspace not found", 404);
	}

	res.status(200).json(new StandardResponse("Updated workspace successfully", workspace));
};

export const deleteWorkspace = async (req: Request, res: Response) => {
	const { id } = req.params;

	//here also deleting the space , list and task

	const workspace = await Workspace.findByIdAndDelete(id);

	if (!workspace) {
		throw new CustomError("Workspace not found", 404);
	}

	res.status(204).json(new StandardResponse("Deleted workspace successfully", {}));
};

export const getInvitedMembers = async (req: Request, res: Response) => {
	const { id } = req.params;
	const workspace = await Workspace.findById(id).populate("members.userId");

	if (!workspace) {
		throw new CustomError("Workspace not found", 404);
	}

	const members = workspace.members.filter((member) => member.status !== "pending");

	res.status(200).json(new StandardResponse("Fetched members successfully", members));
};

export const acceptInvitation = async (req: Request, res: Response) => {
	const userId = "6733105ddf0de189dc9866d9";
	const { id } = req.params;

	const workspace = await Workspace.findById(id);

	if (!workspace) {
		throw new CustomError("Workspace not found", 404);
	}

	const memberExists = workspace.members.some((member) => member.userId && member.userId.toString() === userId);

	if (memberExists) {
		throw new CustomError("User is already a member of the workspace", 400);
	}

	const updatedWorkspace = await Workspace.findByIdAndUpdate(
		id,
		{
			$addToSet: {
				members: { userId, status: "member" },
			},
		},
		{ new: true },
	).populate("members.userId");

	if (!updatedWorkspace) {
		throw new CustomError("Error updating workspace", 500);
	}

	res.status(200).json(new StandardResponse("accepted invitation", updatedWorkspace));
};
