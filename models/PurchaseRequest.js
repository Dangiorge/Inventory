import mongoose from "mongoose";

const PurchaseRequestSchema = new mongoose.Schema({
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["Draft", "Pending Approval", "Approved", "Rejected"],
    default: "Draft",
  },
  items: [
    {
      item: { type: mongoose.Schema.Types.ObjectId, ref: "Item" },
      quantity: { type: Number, required: true, min: 1 },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  approvedAt: Date,
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

export default mongoose.models.PurchaseRequest ||
  mongoose.model("PurchaseRequest", PurchaseRequestSchema);
