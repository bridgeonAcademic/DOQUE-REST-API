import type { Request, Response } from "express";
import { CustomError } from "../utils/error/customError";
import type { CustomRequest } from "../types/interfaces";
import { StandardResponse } from "../utils/standardResponse";
import Chat from "../models/chatModel";

export const createMessages = async (req: CustomRequest, res: Response) => {
	const { workspaceId } = req.params;
	const { content } = req.body;
	const userId = req.user?.id;

	if (!workspaceId) {
		throw new CustomError("Workspace not found", 400);
	}

	const message = new Chat({
		workspace: workspaceId,
		messages: [
			{
				content: content,
				sender: userId,
				timestamp: Date.now(),
			},
		],
	});

	message.save();

	res.status(201).json(new StandardResponse(" messages successful sended", message));
};

export const getMessages = async (req: Request, res: Response) => {
	const { workspaceId } = req.params;

	const messages = await Chat.findOne({ workspaceId: workspaceId }).populate("messages.sender");

	if (!messages) {
		throw new CustomError("Messages not found", 400);
	}

	res.status(200).json(new StandardResponse("Fetched messages successful", messages));
};

export const deleteChat = async (req: Request, res: Response) => {
	const { workspaceId } = req.params;

	const clearChat = await Chat.deleteMany({ workspace: workspaceId });

	if (!clearChat) {
		throw new CustomError("Message not found", 404);
	}

	res.status(204).json(new StandardResponse("Successfully clear the chats", {}));
};

export const deleteMessage = async (req: Request, res: Response) => {
	const { messageId } = req.params;

	const deletedMessage = await Chat.findByIdAndDelete(messageId);

	if (!deletedMessage) {
		throw new CustomError("Message or workspace not found", 404);
	}

	res.status(200).json(new StandardResponse("Message deleted successfully", {}));
};
