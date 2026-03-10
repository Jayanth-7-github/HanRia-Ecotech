import mongoose from "mongoose";

const subscriberSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, trim: true, unique: true },
    subscribed_at: { type: Date, default: () => new Date() },
  },
  { timestamps: true },
);

export const Subscriber = mongoose.model("Subscriber", subscriberSchema);
