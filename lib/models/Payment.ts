import mongoose, { Schema, Document, Model } from 'mongoose';
import { PAYMENT_STATUS, PaymentStatus } from '../constants';

export interface IPaymentProduct {
  productId: string;
  name: string;
  size?: string;
  quantity?: number;
  amount: number;
}

export interface IPayment extends Document {
  merchantOrderId: string;
  transactionId?: string;
  amount: number;
  status: PaymentStatus;
  user: {
    email?: string;
    phone?: string;
    name?: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
  products: IPaymentProduct[];
  rawResponse?: any;
  webhookPayload?: any;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IPaymentProduct>({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  size: { type: String, required: false },
  quantity: { type: Number, required: false },
  amount: { type: Number, required: true },
});

const PaymentSchema = new Schema<IPayment>(
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
      city: String,
      state: String,
      pincode: String,
    },
    products: [ProductSchema],
    rawResponse: Schema.Types.Mixed,
    webhookPayload: Schema.Types.Mixed,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

const Payment: Model<IPayment> = mongoose.models.Payment || mongoose.model<IPayment>("Payment", PaymentSchema);

export default Payment;
