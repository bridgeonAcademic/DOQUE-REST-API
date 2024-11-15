import mongoose, { type Document, Schema, type Types } from "mongoose";

interface ITask extends Document {
	listId: Types.ObjectId;
	title: string;
	description?: string;
	dueDate?: Date;
}

const taskSchema: Schema<ITask> = new Schema(
	{
		listId: { type: Schema.Types.ObjectId, ref: "list", required: true },
		title: { type: String, required: true },
		description: { type: String },
		dueDate: { type: Date },
	},
	{ timestamps: true },
);

const Task = mongoose.model<ITask>("Task", taskSchema);
export default Task;
