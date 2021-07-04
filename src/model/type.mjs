import mongoose from "mongoose";

const typeSchema = new mongoose.Schema(
  {
    type: { type: String, required: true, index: true },
    galleries: { type: [mongoose.Types.ObjectId], required: true },
  },
  {
    collection: "type",
  }
);

export default mongoose.model("Type", typeSchema);
