import mongoose from "mongoose";
import { IBlog } from "../config/interface";

const blogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: "user" },
    title: {
      type: String,
      require: true,
      trim: true,
    },
    content: {
      type: String,
      require: true,
    },
    description: {
      type: String,
      require: true,
      trim: true,
    },
    thumbnail: {
      type: String,
      require: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    earn: {
      type: Number,
      default: 0,
    },
    like: {
      type: Number,
      default: 0,
    },
    comment: {
      type: Number,
      default: 0,
    },
    share: {
      type: Number,
      default: 0,
    },
    likeuser: [{ type: mongoose.Types.ObjectId, ref: "user", default: [] }],
    commentuser: [{ type: mongoose.Types.ObjectId, ref: "user", default: [] }],
    shareuser: [{ type: mongoose.Types.ObjectId, ref: "user", default: [] }],
    category: { type: mongoose.Types.ObjectId, ref: "category" },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IBlog>("blog", blogSchema);
