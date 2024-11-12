import express from "express";
import { validateData } from "../middlewares/zodValidation";
import { workspaceSchema } from "../utils/zodSchemas";
import { errorCatch } from "../utils/error/errorCatch";
import {
	acceptInvitation,
	createWorkspace,
	deleteWorkspace,
	getActiveWorkspace,
	getInvitedMembers,
	getWorkspaceById,
	updateWorkspace,
} from "../controllers/workspaceController";

const router = express.Router();

router.post("/", validateData(workspaceSchema), errorCatch(createWorkspace));
router.get("/", errorCatch(getActiveWorkspace));
router.get("/:id", errorCatch(getWorkspaceById));
router.put("/:id", validateData(workspaceSchema), errorCatch(updateWorkspace));
router.delete("/:id", errorCatch(deleteWorkspace));
router.get("/:id/invited-members", errorCatch(getInvitedMembers));
router.patch("/:id/accept-invitation", errorCatch(acceptInvitation));

export default router;
