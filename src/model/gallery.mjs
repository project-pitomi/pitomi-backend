import mongoose from "mongoose";

const tagSchema = new mongoose.Schema({
  tag: { type: String, required: true },
  male: { type: Number },
  female: { type: Number },
});

const gallerySchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, index: true },
    title: { type: String, required: true },
    artists: { type: [String], required: true },
    group: { type: [String], required: true },
    type: { type: String, required: true },
    series: { type: [String], required: true },
    characters: { type: [String], required: true },
    origin_at: { type: Date, required: true, index: true },
    status: { type: String, required: true, index: true },
    inserted_at: { type: Date, required: true },
    tags: { type: [tagSchema] },
    container_name: { type: String },
    blob_names: { type: [String] },
    blob_names_webp: { type: [String] },
  },
  {
    collection: "gallery",
  }
);

export default mongoose.model("Gallery", gallerySchema);
