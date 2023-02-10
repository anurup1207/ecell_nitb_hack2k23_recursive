import mongoose from "mongoose";
import { INews } from "../config/interface";

const newsSchema = new mongoose.Schema({
  name: {
    type: String,
  },
});

export default mongoose.model<INews>("News", newsSchema);
