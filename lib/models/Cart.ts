import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICartItem {
  productId: string;
  name: string;
  size?: string;
  quantity: number;
  price: number;
  image?: string;
}

export interface ICart extends Document {
  userId: mongoose.Types.ObjectId;
  items: ICartItem[];
  totalAmount: number;
}

const CartItemSchema = new Schema<ICartItem>({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  size: { type: String, required: false },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
  image: { type: String, required: false }
});

const CartSchema = new Schema<ICart>({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    unique: true 
  },
  items: [CartItemSchema],
  totalAmount: { type: Number, default: 0 }
}, { timestamps: true });

const Cart: Model<ICart> = mongoose.models.Cart || mongoose.model<ICart>("Cart", CartSchema);
export default Cart;
