import mongoose from "mongoose";

const groupSchema = new mongoose.Schema(
  {
    group: { type: String, required: true, index: true },
    galleries: { type: [mongoose.Types.ObjectId], required: true },
  },
  {
    collection: "group",
  }
);

export default mongoose.model("Group", groupSchema);
