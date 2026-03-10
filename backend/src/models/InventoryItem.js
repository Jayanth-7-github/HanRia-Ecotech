import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema(
  {
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: { type: Number, required: true },
    production_date: { type: Date, default: () => new Date() },
  },
  { timestamps: true },
);

export const InventoryItem = mongoose.model("InventoryItem", inventorySchema);
