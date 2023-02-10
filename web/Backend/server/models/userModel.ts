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
    account: {
      type: String,
      required: [true, "Please add your email or phone"],
      trim: true,
      unique: true,
    },
    about: {
      type: String,
      trim: true,
      default: "I am using PediaGeek to Connect ,Learn and Grow.",
    },
    paytm: {
      type: String,
      trim: true,
    },
    blogcount: {
      type: Number,
      default: 0,
    },
    referer: {
      type: String,
      default: "PediaGeek",
    },
    password: {
      type: String,
      required: [true, "Please add your password"],
    },
    avatar: {
      type: String,
      default:
        "https://res.cloudinary.com/devatchannel/image/upload/v1602752402/avatar/avatar_cugq40.png",
    },
    role: {
      type: String,
      default: "user", // admin
    },
    type: {
      type: String,
      default: "register", // login
    },
    follower: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Users",
        default: [],
      },
    ],
    following: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Users",
        default: [],
      },
    ],
    notice: {
      type: Boolean,
      default: false,
    },
    preferance: {
      type: Boolean,
      default: false,
    },
    locality: {
      type: String,
      trim: true,
      maxLength: 100,
    },
    city: { type: String, trim: true, maxLength: 100 },
    state: { type: String, trim: true, maxLength: 100 },
    country: { type: String, trim: true, maxLength: 100 },
    language: [{ type: mongoose.Types.ObjectId, ref: "user" }],
    categoryid: [{ type: mongoose.Types.ObjectId, ref: "category" }],
    interest: [{ type: String }],
    isdark: {
      type: Boolean,
      default: true,
    },
    birthday: {
      type: Date,
    },
    work: { type: String, trim: true, maxLength: 100 },
    aspire: { type: String, trim: true, maxLength: 100 },
    gender: { type: String, trim: true, length: 1 },
    organization: { type: String, trim: true, maxLength: 100 },
    rf_token: { type: String, select: false },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IUser>("user", userSchema);
