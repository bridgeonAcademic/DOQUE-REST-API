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

const router = express.Router();

//Space routes
router.post("/", validateData(spaceSchema), errorCatch(createSpace));
router.get("/", errorCatch(getAllSpaces));
router.get("/:id", errorCatch(getSpaceById));
router.put("/:id", validateData(spaceSchema), errorCatch(updateSpaceById));
router.delete("/:id", errorCatch(deleteSpaceById));

export default router;
