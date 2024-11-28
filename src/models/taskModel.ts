import mongoose, { type Document, Schema, type Types } from "mongoose";

interface ITask extends Document {
  listId: Types.ObjectId;
  title: string;
  description?: string;
  dueDate?: Date;
  priority?: string;
  assignedTo?: Types.ObjectId;
}

const taskSchema: Schema<ITask> = new Schema(
  {
    listId: { type: Schema.Types.ObjectId, ref: "list", required: true },
    title: { type: String, required: true },
    description: { type: String },
    priority: { type: String, default: "medium" },
    dueDate: { type: Date },
    assignedTo: [{ type: Schema.Types.ObjectId, ref: "user" }],
  },
  { timestamps: true }
);

const Task = mongoose.model<ITask>("Task", taskSchema);

export default Task;
