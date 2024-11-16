import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken";

const router = Router();

router.use(verifyToken);

router.get("/:spaceId/lists/:listId/tasks", (_req, res) => {
	res.send("Hello from task routes");
});

router.post("/:spaceId/lists/:listId/tasks");

export default router;
