import mongoose from "mongoose";
import { INotice } from "../config/interface";

const noticeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: "user" },
    msg: { type: String },
    desc: { type: String },
    url: { type: String, default: "#" },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<INotice>("Notice", noticeSchema);
