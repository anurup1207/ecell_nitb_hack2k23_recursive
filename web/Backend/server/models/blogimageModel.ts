import mongoose from "mongoose";
import { Blogimage } from "../config/interface";

const imageSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: "user" },
    blog: { type: mongoose.Types.ObjectId, ref: "blog" },
    link: {
      type: String,
      require: true,
      trim: true,
    },
    about: {
      type: String,
      require: true,
      trim: true,
    },
    impression: {
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
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<Blogimage>("image", imageSchema);
