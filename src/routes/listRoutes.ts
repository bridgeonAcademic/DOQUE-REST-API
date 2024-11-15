import express from "express";
import { validateData } from "../middlewares/zodValidation";
import { listSchema } from "../utils/zodSchemas";
import { errorCatch } from "../utils/error/errorCatch";
import { createList, deleteList, getAllLists, updateList } from "../controllers/listControllers";
import { verifyToken } from "../middlewares/verifyToken";

const router = express.Router();

router.post("/:spaceId/lists", verifyToken, validateData(listSchema), errorCatch(createList));
router.get("/:spaceId/lists", verifyToken, errorCatch(getAllLists));
router.put("/:spaceId/lists/:listId", verifyToken, errorCatch(updateList));
router.delete("/:spaceId/lists/:listId", verifyToken, errorCatch(deleteList));

export default router;
