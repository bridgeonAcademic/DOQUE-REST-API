import mongoose, { type Document, Schema, type Types } from "mongoose";

interface IMessage {
	content: string;
	timestamp: Date;
	sender: Types.ObjectId;
}

interface IChat extends Document {
	workspaceId: Types.ObjectId;
	messages: IMessage[];
}

const chatSchema: Schema<IChat> = new Schema(
	{
		workspaceId: {
			type: Schema.Types.ObjectId,
			ref: "workspace",
			required: true,
		},
		messages: [
			{
				content: { type: String, required: true },
				timestamp: { type: Date, required: true },
				sender: { type: Schema.Types.ObjectId, ref: "user", required: true },
			},
		],
	},
	{ timestamps: true },
);

const Chat = mongoose.model<IChat>("Chat", chatSchema);
export default Chat;
