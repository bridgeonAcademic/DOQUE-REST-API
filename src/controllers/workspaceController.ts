import type { Request, Response } from "express";
import type { CustomRequest } from "../types/interfaces";
import Workspace from "../models/workspaceModel";
import { StandardResponse } from "../utils/standardResponse";
import { CustomError } from "../utils/error/customError";
import { hasAccess, sendInvitationEmail } from "../utils/workspaceUtils";
import { User } from "../models/userModel";

export const createWorkspace = async (req: CustomRequest, res: Response) => {
	const { name, description, visibility = "private" } = req.body;

	const userId = req.user?.id;

	const workspace = new Workspace({
		name,
		description,
		visibility,
		members: [userId],
		createdBy: userId,
	});

	await workspace.save();

	res.status(201).json(new StandardResponse("workspace created successfully", workspace));
};

export const getActiveWorkspaces = async (req: CustomRequest, res: Response) => {
	const userId = req.user?.id;

	const activeWorkspaces = await Workspace.find({
		members: { $in: [userId] },
	});

	const pendingWorkspaces = await Workspace.find({
		pendingMembers: { $in: [userId] },
	});

	res.status(200).json(
		new StandardResponse("fetched active workspaces successfully", {
			activeWorkspaces,
			pendingWorkspaces,
		}),
	);
};

export const getWorkspaceById = async (req: CustomRequest, res: Response) => {
	const { id } = req.params;

	const workspace = await Workspace.findById(id);

	if (!workspace) {
		throw new CustomError("Workspace not found", 404);
	}

	if (workspace.visibility === "private") await hasAccess(workspace, req.user?.id || "");

	res.status(200).json(new StandardResponse("fetched workspace successfully", workspace));
};

export const updateWorkspace = async (req: CustomRequest, res: Response) => {
	const { id } = req.params;

	const updateWorkspace = req.body;

	const workspace = await Workspace.findById(id);

	if (!workspace) {
		throw new CustomError("Workspace not found", 404);
	}

	await hasAccess(workspace, req.user?.id || "");

	const updated = await workspace.updateOne({ $set: updateWorkspace }, { new: true });

	res.status(200).json(new StandardResponse(" Workspace updated successfully", updated));
};

export const deleteWorkspace = async (req: CustomRequest, res: Response) => {
	const { id } = req.params;

	//here also deleting the space , list and task

	const workspace = await Workspace.findById(id);

	if (!workspace) {
		throw new CustomError("Workspace not found", 404);
	}

	await hasAccess(workspace, req.user?.id || "");

	await workspace.deleteOne();

	res.status(204).json(new StandardResponse("Workspace deleted successfully"));
};

export const getInvitedMembers = async (req: Request, res: Response) => {
	const { id } = req.params;
	const workspace = await Workspace.findById(id).populate("members", "_id firstName lastName image email");

	if (!workspace) {
		throw new CustomError("Workspace not found", 404);
	}

	const members = workspace.members;

	const pendingMembers = workspace.pendingMembers;

	res.status(200).json(new StandardResponse("Members fetched Successfully", { members, pendingMembers }));
};

export const acceptInvitation = async (req: CustomRequest, res: Response) => {
	const { id } = req.params;
	const userId = req.user?.id;
	const workspace = await Workspace.findById(id);

	if (!workspace) {
		throw new CustomError("Workspace not found", 404);
	}

	const user = await User.findById(userId);
	const member = workspace.pendingMembers.find((member) => member === user?.email);

	if (!member) throw new CustomError("User was not invited to the workspace or invitation already accepted", 400);

	workspace.members.push(user?.id);
	await workspace.save();
	res.status(200).json(new StandardResponse("Accepted invitation", workspace));
};

export const inviteMember = async (req: Request, res: Response) => {
	const { email } = req.body;
	const { id } = req.params;

	const workspace = await Workspace.findById(id);

	if (!workspace) {
		throw new CustomError("Workspace not found", 404);
	}

	const alreadyInvited = workspace.pendingMembers.includes(email);
	if (alreadyInvited) throw new CustomError("User already invited", 400);

	workspace.pendingMembers.push(email);
	await sendInvitationEmail(email, workspace);
	await workspace.save();

	console.log(alreadyInvited);

	res.status(200).json(new StandardResponse(`Invitation sent to ${email} successfully.`, { email, workspaceId: id }));
};
