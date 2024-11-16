import mongoose, { type Document, Schema } from "mongoose";

export interface IWorkspace extends Document {
	name: string;
	description?: string;
	members: mongoose.Schema.Types.ObjectId[];
	pendingMembers: string[];
	spaces: mongoose.Schema.Types.ObjectId[];
	visibility: string;
	createdBy: mongoose.Schema.Types.ObjectId;
}

const workspaceSchema: Schema<IWorkspace> = new Schema(
	{
		name: { type: String, required: true },
		description: { type: String },
		members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
		pendingMembers: [{ type: String }],
		spaces: [{ type: mongoose.Schema.Types.ObjectId, ref: "Space" }],
		visibility: { type: String, default: "private", required: true },
		createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
	},
	{ timestamps: true },
);

const Workspace = mongoose.model<IWorkspace>("Workspace", workspaceSchema);
export default Workspace;
