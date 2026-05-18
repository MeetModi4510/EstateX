import mongoose, { Document, Schema } from 'mongoose';

export interface IBrokerProfile extends Document {
  userId: mongoose.Types.ObjectId;
  brokerId: string;
  businessName: string;
  profileImage?: string;
  experienceYears: number;
  bio?: string;
  specialization?: string;
  serviceAreas: string[];
  rating: number;
  totalDeals: number;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  createdAt: Date;
  updatedAt: Date;
}

const BrokerProfileSchema = new Schema<IBrokerProfile>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  brokerId: { type: String, required: true, unique: true },
  businessName: { type: String, required: true },
  profileImage: { type: String },
  experienceYears: { type: Number, required: true },
  bio: { type: String },
  specialization: { type: String },
  serviceAreas: [{ type: String }],
  rating: { type: Number, default: 0 },
  totalDeals: { type: Number, default: 0 },
  status: { type: String, enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED'], default: 'ACTIVE' }
}, { timestamps: true });

export const BrokerProfile = mongoose.model<IBrokerProfile>('BrokerProfile', BrokerProfileSchema);
