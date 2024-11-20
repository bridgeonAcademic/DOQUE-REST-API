import mongoose, { type Document, Schema } from "mongoose";

export interface IUser extends Document {
	firstName: string;
	lastName: string;
	email: string;
	image?: string;
	password: string;
	verified: boolean;
	isBlocked: boolean;
}

const userSchema: Schema = new Schema(
	{
		firstName: {
			type: String,
			required: true,
		},
		lastName: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		image: {
			type: String,
			required: false,
		},
		password: {
			type: String,
			required: true,
		},
		phoneNumber: {
			type: String,
			required: false,
		},
		status: {
			type: String,
			default: "active",
		},
		verified: {
			type: Boolean,
			default: false,
		},
		isBlocked: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true },
);

export const User = mongoose.model<IUser>("User", userSchema);
