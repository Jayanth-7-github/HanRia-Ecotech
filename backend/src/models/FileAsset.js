import mongoose from "mongoose";

const fileAssetSchema = new mongoose.Schema(
  {
    file_name: { type: String, required: true, trim: true },
    file_type: { type: String, default: "", trim: true },
    file_path: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
    uploaded_by: { type: String, default: "", trim: true },
  },
  { timestamps: true },
);

export const FileAsset = mongoose.model("FileAsset", fileAssetSchema);
