import mongoose from "mongoose";

const countSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, index: true },
    count: { type: Number, required: true },
  },
  {
    collection: "counts",
  }
);

export default mongoose.model("Count", countSchema);
