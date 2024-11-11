import mongoose, { type Document, Schema, type Types } from "mongoose";

interface ISpace extends Document {
  workspaceId: Types.ObjectId;
  name: string;
  description?: string;
  lists: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const spaceSchema: Schema<ISpace> = new Schema({
  workspaceId: {
    type: Schema.Types.ObjectId,
    ref: "workspace",
    required: true,
  },
  name: { type: String, required: true },
  description: { type: String },
  lists: [{ type: Schema.Types.ObjectId, ref: "lists", required: true }],
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true },
});

const Space = mongoose.model<ISpace>("Space", spaceSchema);
export default Space;
