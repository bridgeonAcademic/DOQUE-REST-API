import type { Response } from "express";
import Task from "../models/taskModel";
import type { CustomRequest } from "../types/interfaces";
import { StandardResponse } from "../utils/standardResponse";
import { CustomError } from "../utils/error/customError";

export const createTask = async (req: CustomRequest, res: Response) => {
  const { title, description, dueDate, priority, assignedTo, listId } =
    req.body;

  const task = new Task({
    listId,
    title,
    description,
    dueDate,
    priority,
    assignedTo,
  });

  await task.save();

  res.status(201).json(new StandardResponse("task created successfully", task));
};

export const getAllTasks = async (req: CustomRequest, res: Response) => {
  const { listId } = req.params;
  const tasks = await Task.find({ listId });

  if (tasks.length === 0) {
    throw new CustomError("Task retrieved succesfully", 404);
  }
  res
    .status(200)
    .json(new StandardResponse("Task retrieved succesfully", tasks, 200));
};

export const updateTask = async (req: CustomRequest, res: Response) => {
  const { taskId } = req.params;
  const { title, description, dueDate, priority, assignedTo, listId } =
    req.body;

  const task = await Task.findByIdAndUpdate(
    taskId,
    { title, description, dueDate, priority, assignedTo, listId },
    { new: true }
  );

  if (!task) {
    throw new CustomError("Task not found", 404);
  }

  res.status(200).json(new StandardResponse("Task updated successfully", task));
};

export const deleteTask = async (req: CustomRequest, res: Response) => {
  const { taskId } = req.params;

  const task = await Task.findByIdAndDelete(taskId);

  if (!task) {
    throw new CustomError("Task not found", 404);
  }

  res.status(200).json(new StandardResponse("Task deleted successfully"));
};

export const moveTask = async (req: CustomRequest, res: Response) => {
  const { taskId } = req.params;
  const { listId } = req.body;

  const task = await Task.findByIdAndUpdate(taskId, { listId }, { new: true });

  if (!task) {
    throw new CustomError("Task not found", 404);
  }

  res.status(200).json(new StandardResponse("Task moved successfully", task));
};
