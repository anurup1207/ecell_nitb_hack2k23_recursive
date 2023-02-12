import mongoose from "mongoose";
import { IUser } from "../config/interface";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add your name"],
      trim: true,
      maxLength: [30, "Your name is up to 20 chars long."],
    },
    accountno: {
      type: Number,
      required: [true, "Please add your Bank account no"],
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Please add your Bank account no"],
      trim: true,
      unique: true,
    },
    adharno: {
      type: Number,
      required: [true, "Please add your Adhar number"],
      trim: true,
      unique: true,
    },
    password1: {
      type: Buffer,
      required: [true, "Please add your sign1 here"],
    },
    password2: {
      type: Buffer,
      required: [true, "Please add your sign2 here"],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IUser>("user", userSchema);
