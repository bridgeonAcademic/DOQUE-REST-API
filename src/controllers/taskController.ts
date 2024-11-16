import type { Response } from "express";
import Task from "../models/taskModel";
import type { CustomRequest } from "../types/interfaces";
import { StandardResponse } from "../utils/standardResponse";

export const createTask = async (req: CustomRequest, res: Response) => {
	const { name, description, dueDate, priority, assignedTo, listId } = req.body;

	const task = new Task({
		listId,
		name,
		description,
		dueDate,
		priority,
		assignedTo,
	});

	await task.save();

	res.status(201).json(new StandardResponse("task created successfully", task));
};
