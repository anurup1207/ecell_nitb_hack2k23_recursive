import mongoose from "mongoose";
import { IWork } from "../config/interface";

const workSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: [true, "already present in the list."],
    required: [true, "Please add a profession"],
    trim: true,
    maxLength: [100, "profession is up to 100 chars long."],
    minlength: 2,
  },
  user: { type: mongoose.Types.ObjectId, ref: "user" },
});

export default mongoose.model<IWork>("Work", workSchema);
