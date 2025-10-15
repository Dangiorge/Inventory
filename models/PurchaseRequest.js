import mongoose from "mongoose";

const PurchaseRequestSchema = new mongoose.Schema({
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  requester_email: { type: String, required: true },
  department: { type: String, required: true },
  remark: { type: String },
  items: [
    {
      // item: { type: mongoose.Schema.Types.ObjectId, ref: "Item" },
      item: { type: String },
      quantity: { type: Number, required: true, min: 1 },
    },
  ],
  status: { type: String, enum: ["Pending", "Approved"], default: "Pending" },
  approver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.PurchaseRequest ||
  mongoose.model("PurchaseRequest", PurchaseRequestSchema);
