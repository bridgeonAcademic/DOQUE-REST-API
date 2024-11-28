import type { Document } from "mongoose";
import mongoose, { Schema } from "mongoose";

export interface PaymentDocument extends Document {
	amount: number;
	currency: string;
	status: string;
	sessionId: string | null;
	userId: string;
	subscription: string;
	createdAt: Date;
}

const PaymentSchema = new Schema<PaymentDocument>(
	{
		amount: { type: Number, required: true },
		currency: { type: String, required: true },
		status: { type: String, required: true },
		userId: { type: String, required: true },
		subscription: { type: String, required: true },
		sessionId: { type: String, required: true },
	},
	{ timestamps: true },
);

export const PaymentModel = mongoose.model<PaymentDocument>("Payment", PaymentSchema);
