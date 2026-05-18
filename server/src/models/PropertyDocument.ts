import mongoose, { Document, Schema } from 'mongoose';

export interface IPropertyDocument extends Document {
  propertyId: mongoose.Types.ObjectId;
  documentType: string;
  documentUrl: string;
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  uploadedAt: Date;
}

const PropertyDocumentSchema = new Schema<IPropertyDocument>({
  propertyId: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
  documentType: { type: String, required: true },
  documentUrl: { type: String, required: true },
  verificationStatus: { 
    type: String, 
    enum: ['PENDING', 'VERIFIED', 'REJECTED'],
    default: 'PENDING'
  },
  uploadedAt: { type: Date, default: Date.now }
});

export const PropertyDocument = mongoose.model<IPropertyDocument>('PropertyDocument', PropertyDocumentSchema);
