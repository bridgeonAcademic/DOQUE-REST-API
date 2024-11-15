import express from "express";
import { verifyToken } from "../middlewares/verifyToken";
import { errorCatch } from "../utils/error/errorCatch";
import { searchWorkspace } from "../controllers/searchController";

const router = express.Router();

router.use(verifyToken);

router.get("/", errorCatch(searchWorkspace));

export default router;
