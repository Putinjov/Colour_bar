import mongoose from "mongoose";

const CatalogSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, default: "default" },
    data: { type: mongoose.Schema.Types.Mixed, required: true }, // весь JSON
  },
  { timestamps: true }
);

export const Catalog = mongoose.model("Catalog", CatalogSchema);
