import express from "express";
import { validateData } from "../middlewares/zodValidation";
import { spaceSchema } from "../utils/zodSchemas";
import { errorCatch } from "../utils/error/errorCatch";
import {
	createSpace,
	deleteSpaceById,
	getAllSpaces,
	getSpaceById,
	updateSpaceById,
} from "../controllers/spaceController";
import { verifyToken } from "../middlewares/verifyToken";

const router = express.Router();

//Space routes
router.post("/", verifyToken, validateData(spaceSchema), errorCatch(createSpace));
router.get("/", verifyToken, errorCatch(getAllSpaces));
router.get("/:id", verifyToken, errorCatch(getSpaceById));
router.put("/:id", verifyToken, validateData(spaceSchema), errorCatch(updateSpaceById));
router.delete("/:id", verifyToken, errorCatch(deleteSpaceById));

export default router;
