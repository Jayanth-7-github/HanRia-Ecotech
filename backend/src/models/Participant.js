import mongoose from "mongoose";

const participantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, default: "", trim: true },
    institution: { type: String, default: "", trim: true },
    program_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TrainingProgram",
      required: true,
    },
  },
  { timestamps: true },
);

export const Participant = mongoose.model("Participant", participantSchema);
