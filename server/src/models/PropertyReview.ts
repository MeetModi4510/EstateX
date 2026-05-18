import mongoose, { Document, Schema } from 'mongoose';

export interface IPropertyReview extends Document {
  propertyId: mongoose.Types.ObjectId;
  brokerId: mongoose.Types.ObjectId;
  qualityScore: number;
  verificationStatus: string;
  privateNotes?: string;
  rejectionReason?: string;
  changesRequested?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PropertyReviewSchema = new Schema<IPropertyReview>({
  propertyId: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
  brokerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  qualityScore: { type: Number, required: true },
  verificationStatus: { type: String, required: true },
  privateNotes: { type: String },
  rejectionReason: { type: String },
  changesRequested: { type: String }
}, { timestamps: true });

export const PropertyReview = mongoose.model<IPropertyReview>('PropertyReview', PropertyReviewSchema);
