import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  sku: {
    type: String,
    unique: true,
    sparse: true, // optional stock keeping unit for identification
  },
  brand: {
    type: String,
    default: "",
  },
  description: {
    type: String,
    default: "",
  },
  unit: {
    type: String,
    default: "pcs", // pieces, kg, liter, etc.
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

export default mongoose.models.Item || mongoose.model("Item", ItemSchema);

// import mongoose from "mongoose";

// const ItemSchema = new mongoose.Schema({
//   name: { type: String, required: true, trim: true },
//   category: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Category",
//     required: true,
//   },
//   description: { type: String },
//   brand: { type: String }, // helpful for pharmacy, electronics, clothing, etc.
//   unit: { type: String, default: "pcs" }, // e.g. pcs, box, kg, liter
//   appliedDate: { type: Date, default: Date.now },
// });

// export default mongoose.models.Item || mongoose.model("Item", ItemSchema);
