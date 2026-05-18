import mongoose, { Document, Schema } from 'mongoose';

export interface ILead extends Document {
  propertyId: mongoose.Types.ObjectId;
  brokerId: mongoose.Types.ObjectId;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  budget: string;
  message: string;
  preferredContactTime: string;
  inquiryType: 'INFORMATION' | 'CALLBACK' | 'VISIT';
  leadScore: number;
  status: 'NEW' | 'CONTACTED' | 'INTERESTED' | 'VISIT_SCHEDULED' | 'NEGOTIATION' | 'TOKEN_RECEIVED' | 'DEAL_COMPLETED' | 'LOST';
  createdAt: Date;
  updatedAt: Date;
  lastContactedAt?: Date;
  nextFollowUpAt?: Date;
}

const LeadSchema = new Schema<ILead>({
  propertyId: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
  brokerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  buyerName: { type: String, required: true },
  buyerEmail: { type: String, required: true },
  buyerPhone: { type: String, required: true },
  budget: { type: String, required: true },
  message: { type: String },
  preferredContactTime: { type: String },
  inquiryType: { type: String, enum: ['INFORMATION', 'CALLBACK', 'VISIT'], default: 'INFORMATION' },
  leadScore: { type: Number, default: 50 },
  status: { 
    type: String, 
    enum: ['NEW', 'CONTACTED', 'INTERESTED', 'VISIT_SCHEDULED', 'NEGOTIATION', 'TOKEN_RECEIVED', 'DEAL_COMPLETED', 'LOST'],
    default: 'NEW'
  },
  lastContactedAt: { type: Date },
  nextFollowUpAt: { type: Date }
}, { timestamps: true });

export const Lead = mongoose.model<ILead>('Lead', LeadSchema);
