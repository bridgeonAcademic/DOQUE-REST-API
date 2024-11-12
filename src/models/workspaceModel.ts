import mongoose, { type Document, Schema } from "mongoose";

interface IMember {
	userId: mongoose.Schema.Types.ObjectId;
	status: string;
}

interface IWorkspace extends Document {
	name: string;
	description?: string;
	members: IMember[];
	spaces: mongoose.Schema.Types.ObjectId[];
	visibility: string;
	createdBy: mongoose.Schema.Types.ObjectId;
}

const workspaceSchema: Schema<IWorkspace> = new Schema(
	{
		name: { type: String, required: true },
		description: { type: String },
		members: [
			{
				userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
				status: { type: String, default: "pending" },
			},
		],
		spaces: [{ type: mongoose.Schema.Types.ObjectId, ref: "Space" }],
		visibility: { type: String, default: "private", required: true },
		createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
	},
	{ timestamps: true },
);

const Workspace = mongoose.model<IWorkspace>("Workspace", workspaceSchema);
export default Workspace;
