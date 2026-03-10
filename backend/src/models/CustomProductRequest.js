import mongoose from "mongoose";

const customProductRequestSchema = new mongoose.Schema(
  {
    company_name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    industry: { type: String, default: "", trim: true },
    product_description: { type: String, required: true, trim: true },
    material_preference: { type: String, default: "", trim: true },
    attachment: { type: String, default: "", trim: true },
    status: {
      type: String,
      enum: ["submitted", "in_review", "resolved"],
      default: "submitted",
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

export const CustomProductRequest = mongoose.model(
  "CustomProductRequest",
  customProductRequestSchema,
);
