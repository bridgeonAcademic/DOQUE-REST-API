import express from "express";
import { errorCatch } from "../../utils/error/errorCatch";
import { validateData } from "../../middlewares/zodValidation";
import { adminLoginSchema } from "../../utils/zodSchemas";
import { adminLogin } from "../../controllers/admin/adminAuthController";
import { getAllUsers } from "../../controllers/admin/adminController";
import { adminAuthenticate } from "../../middlewares/admin/adminAuthenticate";

const router = express.Router();

router.post("/admin/login", validateData(adminLoginSchema), errorCatch(adminLogin));
router.get("/admin/users", adminAuthenticate, errorCatch(getAllUsers));

export default router;
