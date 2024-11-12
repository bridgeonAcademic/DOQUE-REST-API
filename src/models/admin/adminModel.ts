import mongoose, { type Document, Schema } from "mongoose";

export interface IAdmin extends Document {
	email: string;
	password: string;
}

const adminSchema: Schema = new Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true },
);

export const Admin = mongoose.model<IAdmin>("Admin", adminSchema);
