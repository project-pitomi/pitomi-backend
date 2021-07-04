import mongoose from "mongoose";

const seriesSchema = new mongoose.Schema(
  {
    series: { type: String, required: true, index: true },
    galleries: { type: [mongoose.Types.ObjectId], required: true },
  },
  {
    collection: "series",
  }
);

export default mongoose.model("Series", seriesSchema);
