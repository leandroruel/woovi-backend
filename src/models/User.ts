import { getCurrentTimeStamp } from "@/helpers/date";
import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
const { Schema, model } = mongoose;

interface IUser {
  name: string;
  tax_id: string;
  email: string;
  password: string;
  password_reset_token?: string
  gender?: 'Male' | 'Female';
  birthdate: Date;
  role: 'Admin' | 'User';
}

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    tax_id: {
      type: String,
      required: true,
      unique: true,
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
    password_reset_token: {
      type: String,
    },
    gender: {
      type: String,
      enum: ["Male", "Female"],
    },
    birthdate: {
      type: Date,
      required: true,
    },
    role: { type: String, enum: ["Admin", "User"], default: "User" },
  },
  {
    timestamps: true,
    collation: { locale: "pt", strength: 2 },
    default: getCurrentTimeStamp(),
  },
);

userSchema.plugin(mongoosePaginate);
userSchema.index({ email: -1 }, { unique: true });

const User = model<IUser>("Users", userSchema);

export default User;
