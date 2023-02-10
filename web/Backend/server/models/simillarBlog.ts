import mongoose from "mongoose";
import { Goodblog } from "../config/interface";

const recommending_blogSchema = new mongoose.Schema({
  recommending_list: [{ type: mongoose.Types.ObjectId, ref: "blog" }],
});

export default mongoose.model<Goodblog>(
  "recommending_blog",
  recommending_blogSchema
);
