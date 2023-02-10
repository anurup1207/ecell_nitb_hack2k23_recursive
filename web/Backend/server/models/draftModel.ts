import mongoose from "mongoose";
import { IDraft } from "../config/interface";

const draftSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: "user" },
    title: {
      type: String,
      trim: true,
    },
    content: {
      type: String,
      maxLength: 10000,
    },
    description: {
      type: String,
      trim: true,
        maxLength: 1000,
    },
    thumbnail: {
      type: String,
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: "category",
    },
  },
  {
    timestamps: true,
  }
);
export default mongoose.model<IDraft>("draft", draftSchema);
