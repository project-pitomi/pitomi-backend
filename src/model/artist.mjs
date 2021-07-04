import mongoose from "mongoose";

const artistSchema = new mongoose.Schema(
  {
    artist: { type: String, required: true, index: true },
    galleries: { type: [mongoose.Types.ObjectId], required: true },
  },
  {
    collection: "artist",
  }
);

export default mongoose.model("Artist", artistSchema);
