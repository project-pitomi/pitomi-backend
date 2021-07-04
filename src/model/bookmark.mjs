import mongoose from "mongoose";

const bookmarkSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Types.ObjectId, required: true, index: true },
    galleryId: { type: mongoose.Types.ObjectId, required: true },
  },
  {
    collection: "bookmark",
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  }
);

bookmarkSchema.index({ userId: 1, galleryId: 1 }, { unique: true });
bookmarkSchema.index({ createdAt: -1 });

export default mongoose.model("Bookmark", bookmarkSchema);
