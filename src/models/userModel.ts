import mongoose, { type Document, Schema } from "mongoose";

interface IUser extends Document {
  name: string;
  email: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema: Schema<IUser> = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  image: { type: String },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true },
});

const User = mongoose.model<IUser>("User", userSchema);
export default User;
