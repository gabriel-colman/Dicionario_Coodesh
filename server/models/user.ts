import mongoose, { Document, Schema } from "mongoose";

interface IUser extends Document {
  name?: string;
  email: string;
  password: string;
  favorites: string[];
  history: string[];
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  favorites: [{ type: String }],
  history: [{ type: String }],
});

const User = mongoose.model<IUser>("User", userSchema);
export default User;
