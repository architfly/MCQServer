import mongoose, { Document, Schema, Model } from "mongoose";

export interface isUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone_number: number;
  country: string;
  role: "user" | "admin";
}

const userSchema: Schema<isUser> = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone_number: {
      type: Number,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      required: true,
      default: "user",
    },
  },
  { timestamps: true }
);

const User: Model<isUser> = mongoose.model<isUser>("User", userSchema);
export default User;
