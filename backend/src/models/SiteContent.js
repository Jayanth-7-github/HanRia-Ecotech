import mongoose from "mongoose";

const siteContentSchema = new mongoose.Schema(
  {
    vision: { type: String, default: "", trim: true },
    mission: { type: String, default: "", trim: true },
    technologies: { type: [String], default: [] },
    contactEmail: { type: String, default: "", trim: true },
    contactLocation: { type: String, default: "", trim: true },
  },
  { timestamps: true },
);

// Keep a single document.
export const SiteContent = mongoose.model("SiteContent", siteContentSchema);
