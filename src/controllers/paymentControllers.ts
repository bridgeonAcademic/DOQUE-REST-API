import type { NextFunction, Request, Response } from "express";
import { CustomError } from "../utils/error/customError";
import { StandardResponse } from "../utils/standardResponse";
import { PaymentModel } from "../models/paymentModel";
import Stripe from "stripe";
import type { CustomRequest } from "../types/interfaces";
import { User } from "../models/userModel";

// Create Payment Intent
export const createPaymentIntent = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
	const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");
	const userId = req.user?.id;
	const { amount, subscription, currency } = req.body;

	try {
		const session = await stripe.checkout.sessions.create({
			payment_method_types: ["card"],
			ui_mode: "embedded",
			currency: currency || "inr",
			mode: "payment",
			line_items: [
				{
					price_data: {
						currency: currency || "inr",
						product_data: {
							name: subscription || "Subscription",
						},
						unit_amount: amount * 100,
					},
					quantity: 1,
				},
			],
			return_url: `${process.env.CLIENT_URL}/paymentsuccess?session_id={CHECKOUT_SESSION_ID}`,
		});

		const newPayment = new PaymentModel({
			currency,
			status: "pending",
			userId,
			amount,
			subscription,
		});
		newPayment.sessionId = session.id;
		await newPayment.save();

		res
			.status(200)
			.json(new StandardResponse("Payment intent created successfully", { clientSecret: session.client_secret }));
	} catch (error) {
		next(new CustomError((error as Error).message || "Failed to create payment intent", 500));
	}
};

// Get Payment Details
export const getPaymentDetails = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
	try {
		const { sessionId } = req.params;

		const payment = await PaymentModel.findOne({ sessionId });

		if (!payment) {
			throw new CustomError("Payment not found", 404);
		}

		res.status(200).json(new StandardResponse("Payment details fetched successfully", payment));
	} catch (error) {
		next(new CustomError((error as Error).message || "Failed to fetch payment details", 500));
	}
};

//payment success
export const paymentSuccess = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	const { sessionId } = req.params;

	const payment = await PaymentModel.findOne({ sessionId });

	if (!payment) {
		throw new CustomError("Payment not found", 404);
	}

	if (payment.status === "paid") {
		throw new CustomError("Payment has already been processed", 400, "PAYMENT_ALREADY_PROCESSED");
	}

	payment.status = "paid";
	await payment.save();

	const user = await User.findById(payment.userId);

	if (!user) {
		throw new CustomError("User not found", 404);
	}

	user.subscription = payment.subscription;
	await user.save();

	res.status(200).json(new StandardResponse("Payment processed successfully", { payment }));
};
