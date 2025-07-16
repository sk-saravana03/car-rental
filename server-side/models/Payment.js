// models/Payment.js
import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    method: { type: String, enum: ["Stripe", "Razorpay"], required: true },
    transactionId: { type: String, required: true, unique: true },
    status: { type: String, enum: ["success", "failed", "pending"], default: "pending" }
  },
  { timestamps: true }
);

export default mongoose.model("Payment", PaymentSchema);