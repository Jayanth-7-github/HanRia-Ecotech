import mongoose from "mongoose";

const collaborationRequestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    organization: { type: String, default: "", trim: true },
    email: { type: String, required: true, trim: true },
    research_area: { type: String, default: "", trim: true },
    proposal_file: { type: String, default: "", trim: true },
    status: {
      type: String,
      enum: ["submitted", "approved", "rejected"],
      default: "submitted",
    },
    submitted_at: { type: Date, default: () => new Date() },
  },
  { timestamps: true },
);

export const CollaborationRequest = mongoose.model(
  "CollaborationRequest",
  collaborationRequestSchema,
);
