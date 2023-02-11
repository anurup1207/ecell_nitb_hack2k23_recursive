import mongoose from "mongoose";
import { INotification } from "../config/interface";

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Types.ObjectId, ref: "user" },
  msg: [
    {
      msg: { type: String },
      desc: { type: String },
      time: { type: Date, default: new Date() },
      url: { type: String, default: "#" },
    },
  ],
  new: { type: Boolean, default: true },
});

export default mongoose.model<INotification>(
  "Notification",
  notificationSchema
);
