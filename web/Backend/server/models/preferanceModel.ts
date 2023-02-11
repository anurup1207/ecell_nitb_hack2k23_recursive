import mongoose from "mongoose";
import { type } from "os";
import { IPreferance } from "../config/interface";

const preferanceSchema = new mongoose.Schema({
  _id: { type: mongoose.Types.ObjectId, ref: "user" },
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
});

export default mongoose.model<IPreferance>("prefernce", preferanceSchema);
