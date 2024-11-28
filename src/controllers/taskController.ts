import type { Response } from "express";
import Task from "../models/taskModel";
import type { CustomRequest } from "../types/interfaces";
import { StandardResponse } from "../utils/standardResponse";
import { CustomError } from "../utils/error/customError";

export const createTask = async (req: CustomRequest, res: Response) => {
  const { title, description, dueDate, priority, assignedTo } = req.body;
  const { listId } = req.params;

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

export const getTaskById = async (req: CustomRequest, res: Response) => {
  const { taskId } = req.params;

  const task = await Task.findById(taskId);

  if (!task) {
    throw new CustomError("Task not found", 404);
  }

  res
    .status(200)
    .json(new StandardResponse("Task retrieved succesfully", task, 200));
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
  const { targetListId } = req.body;

  const task = await Task.findByIdAndUpdate(
    taskId,
    { listId: targetListId },
    { new: true }
  );

  if (!task) {
    throw new CustomError("Task not found", 404);
  }

  res.status(200).json(new StandardResponse("Task moved successfully", task));
};
