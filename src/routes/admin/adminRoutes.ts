import express from "express";
import { errorCatch } from "../../utils/error/errorCatch";
import { validateData } from "../../middlewares/zodValidation";
import { adminLoginSchema } from "../../utils/zodSchemas";
import { adminLogin } from "../../controllers/admin/adminAuthController";
import {
	blockUser,
	getAllSubscription,
	getAllUsers,
	getAllWorkspacesWithSpaces,
	getWorkspaceById,
} from "../../controllers/admin/adminController";
import { adminAuthenticate } from "../../middlewares/admin/adminAuthenticate";

const router = express.Router();

router.post("/login", validateData(adminLoginSchema), errorCatch(adminLogin));
router.get("/users", adminAuthenticate, errorCatch(getAllUsers));
router.patch("/blockuser/:userId", adminAuthenticate, errorCatch(blockUser));
router.get("/workspaces", adminAuthenticate, errorCatch(getAllWorkspacesWithSpaces));
router.get("/workspace/:workspaceId", adminAuthenticate, errorCatch(getWorkspaceById));
router.get("/subscription", adminAuthenticate, errorCatch(getAllSubscription));

export default router;
