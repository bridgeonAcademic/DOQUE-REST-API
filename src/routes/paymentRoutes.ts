import express from "express";
import { verifyToken } from "../middlewares/verifyToken";
import { createPaymentIntent, getPaymentDetails, paymentSuccess } from "../controllers/paymentControllers";
import { errorCatch } from "../utils/error/errorCatch";

const router = express.Router();

router.post("/create-payment-intent", verifyToken, createPaymentIntent);
router.get("/payment-details/:sessionId", verifyToken, getPaymentDetails);
router.put("/success/:sessionId", verifyToken, errorCatch(paymentSuccess));

export default router;
