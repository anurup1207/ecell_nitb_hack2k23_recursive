import mongoose from "mongoose";
import { IBalance } from "../config/interface";

const balanceSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: "user" },
    balance: {
      type: Number,
      default: 0,
    },
    referalbalance: {
      type: Number,
      default: 0,
    },
    blogbalance: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IBalance>("Balance", balanceSchema);
