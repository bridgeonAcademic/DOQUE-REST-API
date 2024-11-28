import express from "express";
import { forgotPassword, login, register, reSendOtp, resetPassword, verifyOtp } from "../controllers/authController";
import { errorCatch } from "../utils/error/errorCatch";
import { validateData } from "../middlewares/zodValidation";
import { loginSchema, otpSchema, registerSchema } from "../utils/zodSchemas";

const router = express.Router();

//Register user
router.post("/register", validateData(registerSchema), errorCatch(register));
router.post("/login", validateData(loginSchema), errorCatch(login));
router.post("/verifyotp", validateData(otpSchema), errorCatch(verifyOtp));
router.post("/resendotp", errorCatch(reSendOtp));
router.post("/forgotpassword", errorCatch(forgotPassword));
router.patch("/resetpassword/:token", errorCatch(resetPassword));

export default router;
