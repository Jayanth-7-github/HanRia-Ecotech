import mongoose from "mongoose";

const analyticsEventSchema = new mongoose.Schema(
  {
    type: { type: String, required: true, trim: true },
    path: { type: String, default: "", trim: true },
    meta: { type: Object, default: {} },
  },
  { timestamps: true },
);

export const AnalyticsEvent = mongoose.model(
  "AnalyticsEvent",
  analyticsEventSchema,
);
