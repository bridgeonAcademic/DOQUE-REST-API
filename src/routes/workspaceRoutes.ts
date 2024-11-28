import express from "express";
import { validateData } from "../middlewares/zodValidation";
import { inviteSchema, workspaceSchema } from "../utils/zodSchemas";
import { errorCatch } from "../utils/error/errorCatch";
import {
	acceptInvitation,
	createWorkspace,
	deleteWorkspace,
	getActiveWorkspaces,
	getInvitedMembers,
	getWorkspaceById,
	inviteMember,
	updateWorkspace,
} from "../controllers/workspaceController";
import { verifyToken } from "../middlewares/verifyToken";

const router = express.Router();

router.use(verifyToken);

router.post("/", validateData(workspaceSchema), errorCatch(createWorkspace));
router.get("/", errorCatch(getActiveWorkspaces));
router.get("/:id", errorCatch(getWorkspaceById));
router.put("/:id", validateData(workspaceSchema), errorCatch(updateWorkspace));
router.delete("/:id", errorCatch(deleteWorkspace));
router.post("/:id/invite", validateData(inviteSchema), errorCatch(inviteMember));
router.patch("/:id/accept-invitation", errorCatch(acceptInvitation));
router.get("/:id/invited-members", errorCatch(getInvitedMembers));

export default router;
