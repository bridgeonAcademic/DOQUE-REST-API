import mongoose, { type Document, Schema, type Types } from "mongoose";

interface IMessage {
  content: string;
  timestamp: Date;
  sender: Types.ObjectId;
}

interface IChat extends Document {
  workspace: Types.ObjectId;
  messages: IMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const chatSchema: Schema<IChat> = new Schema({
  workspace: {
    type: Schema.Types.ObjectId,
    ref: "Workspace",
    required: true,
  },
  messages: [
    {
      content: { type: String, required: true },
      timestamp: { type: Date, required: true },
      sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    },
  ],
});

const Chat = mongoose.model<IChat>("Chat", chatSchema);
export default Chat;
