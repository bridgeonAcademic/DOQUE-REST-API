import { type Document, model, Schema } from "mongoose";

interface IOtp extends Document {
	email: string;
	otp: string;
	updatedAt: Date;
}

const otpSchema: Schema<IOtp> = new Schema(
	{
		email: { type: String, required: true },
		otp: { type: String, required: true },
	},
	{ timestamps: true },
);

export const Otp = model<IOtp>("Otp", otpSchema);
