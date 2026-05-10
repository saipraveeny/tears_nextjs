import mongoose from "mongoose";
import { PAYMENT_STATUS } from "../constants.js";

const ProductSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  amount: { type: Number, required: true },
});

const PaymentSchema = new mongoose.Schema(
  {
    merchantOrderId: { type: String, required: true, unique: true },
    transactionId: { type: String, index: true },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
      default: PAYMENT_STATUS.INITIATED,
    },
    user: {
      email: String,
      phone: String,
      name: String,
      address: String,
    },
    products: [ProductSchema],
    rawResponse: mongoose.Schema.Types.Mixed,
    webhookPayload: mongoose.Schema.Types.Mixed,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

const Payment = mongoose.model("Payment", PaymentSchema);

export default Payment;
