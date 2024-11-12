import mongoose, { type Document, Schema, type Types } from "mongoose";

interface ISpace extends Document {
	workspaceId: Types.ObjectId;
	name: string;
	description?: string;
	lists: Types.ObjectId[];
}

const spaceSchema: Schema<ISpace> = new Schema(
	{
		workspaceId: {
			type: Schema.Types.ObjectId,
			ref: "workspace",
			required: true,
		},
		name: { type: String, required: true },
		description: { type: String },
		lists: [{ type: Schema.Types.ObjectId, ref: "lists", required: true }],
	},
	{ timestamps: true },
);

const Space = mongoose.model<ISpace>("Space", spaceSchema);
export default Space;
