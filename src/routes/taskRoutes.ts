import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken";
import { validateData } from "../middlewares/zodValidation";
import { createTasksSchema, updateTaskSchema } from "../utils/zodSchemas";
import {
  createTask,
  deleteTask,
  getAllTasks,
  moveTask,
  updateTask,
} from "../controllers/taskController";
import { errorCatch } from "../utils/error/errorCatch";

const router = Router();

router.use(verifyToken);

router.get(
  "/:spaceId/lists/:listId/tasks",
  verifyToken,
  errorCatch(getAllTasks)
);

router.post(
  "/:spaceId/lists/:listId/tasks",
  verifyToken,
  validateData(createTasksSchema),
  errorCatch(createTask)
);
router.put(
  "/:spaceId/lists/:listId/tasks/:taskId",
  verifyToken,
  validateData(updateTaskSchema),
  errorCatch(updateTask)
);
router.delete(
  "/:spaceId/lists/:listId/tasks/:taskId",
  verifyToken,
  errorCatch(deleteTask)
);
router.patch(
  "/:spaceId/lists/:listId/tasks/:taskId",
  verifyToken,
  errorCatch(moveTask)
);
export default router;
