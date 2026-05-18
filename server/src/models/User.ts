import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
  role: 'PROPERTY_OWNER' | 'BROKER' | 'ADMIN';
  accountStatus: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  passwordHash: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['PROPERTY_OWNER', 'BROKER', 'ADMIN'], 
    required: true 
  },
  accountStatus: {
    type: String,
    enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED'],
    default: 'ACTIVE'
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date
}, { timestamps: true });

export const User = mongoose.model<IUser>('User', UserSchema);
