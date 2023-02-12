import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add your category"],
      trim: true,
      unique: true,
      maxLength: [50, "Name is up to 50 chars long."],
    },
    email: {
      type: String,
      required: [true, "Please add your Bank account no"],
      trim: true,
      unique: true,
    },
    plan: {
      type: String,
      trim: true,
    },
    apicount: {
      type: Number,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("category", companySchema);
