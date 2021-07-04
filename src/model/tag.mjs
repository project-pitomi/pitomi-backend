import mongoose from "mongoose";

const tagSchema = new mongoose.Schema(
  {
    tagName: { type: String, required: true },
    tagType: { type: String, required: true },
    galleries: { type: [mongoose.Types.ObjectId], required: true },
  },
  {
    collection: "tag",
  }
);

tagSchema.index({ tagName: 1, tagType: 1 });

export default mongoose.model("Tag", tagSchema);
