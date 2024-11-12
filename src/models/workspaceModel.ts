import mongoose, { type Document, Schema } from "mongoose";

interface IWorkspace extends Document {
  name: string;
  description?: string;
  members: mongoose.Schema.Types.ObjectId[];
  spaces: mongoose.Schema.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const workspaceSchema: Schema<IWorkspace> = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  members: [
    { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  ],
  spaces: [{ type: mongoose.Schema.Types.ObjectId, ref: "space" }],
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true },
});

const Workspace = mongoose.model<IWorkspace>("Workspace", workspaceSchema);
export default Workspace;
