import mongoose from "mongoose";

const trainingProgramSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },
    date: { type: Date },
    duration: { type: String, default: "", trim: true },
    location: { type: String, default: "", trim: true },
    mode: { type: String, enum: ["online", "offline"], required: true },
  },
  { timestamps: true },
);

export const TrainingProgram = mongoose.model(
  "TrainingProgram",
  trainingProgramSchema,
);
