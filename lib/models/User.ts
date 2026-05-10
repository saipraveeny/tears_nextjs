import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcrypt';
import { USER_ROLE, UserRole } from '../constants';

export interface IUser extends Document {
  email: string;
  passwordHash?: string;
  role: UserRole;
  name?: string;
  phone?: string;
  authProvider: 'email' | 'google' | 'phone';
  addresses: {
    tag: string;
    street?: string;
    city?: string;
    state?: string;
    pincode?: string;
    isDefault: boolean;
  }[];
  otp?: {
    code: string;
    expiresAt: Date;
  };
  refreshToken?: string;
  verifyPassword(password: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: false },
  role: { type: String, enum: Object.values(USER_ROLE), default: 'viewer' },
  name: { type: String },
  phone: { type: String, sparse: true, unique: true },
  authProvider: { type: String, enum: ['email', 'google', 'phone'], default: 'email' },
  addresses: [{
    tag: { type: String, default: 'Home' },
    street: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String },
    isDefault: { type: Boolean, default: false }
  }],
  otp: {
    code: String,
    expiresAt: Date,
  },
  refreshToken: String,
}, { timestamps: true });

UserSchema.methods.verifyPassword = async function(password: string): Promise<boolean> {
  if (!this.passwordHash) return false;
  return await bcrypt.compare(password, this.passwordHash);
};

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export default User;
