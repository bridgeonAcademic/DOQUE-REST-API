import express from "express";
import { errorCatch } from "../utils/error/errorCatch";
import { createMessages, deleteChat, deleteMessage, getMessages } from "../controllers/chatController";
import { validateData } from "../middlewares/zodValidation";
import { chatSchema } from "../utils/zodSchemas";

const router = express.Router();

router.post("/workspaces/:workspaceId/messages", validateData(chatSchema), errorCatch(createMessages));
router.get("/workspaces/:workspaceId/messages", errorCatch(getMessages));
router.delete("/workspaces/:workspaceId/messages", errorCatch(deleteChat));
router.delete("/workspaces/:workspaceId/messages/:messageId", errorCatch(deleteMessage));

export default router;
