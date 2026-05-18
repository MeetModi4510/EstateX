import mongoose, { Document, Schema } from 'mongoose';

export interface IPropertyOwnerProfile extends Document {
  userId: mongoose.Types.ObjectId;
  profileImage?: string;
  address?: string;
  city?: string;
  state?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PropertyOwnerProfileSchema = new Schema<IPropertyOwnerProfile>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  profileImage: { type: String },
  address: { type: String },
  city: { type: String },
  state: { type: String }
}, { timestamps: true });

export const PropertyOwnerProfile = mongoose.model<IPropertyOwnerProfile>('PropertyOwnerProfile', PropertyOwnerProfileSchema);
