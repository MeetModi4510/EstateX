import mongoose, { Document, Schema } from 'mongoose';

export interface IDeal extends Document {
  propertyId: mongoose.Types.ObjectId;
  leadId: mongoose.Types.ObjectId;
  brokerId: mongoose.Types.ObjectId;
  propertyPrice: number;
  commissionPercentage: number;
  estimatedCommission: number;
  status: 'NEGOTIATION' | 'TOKEN_RECEIVED' | 'COMPLETED' | 'LOST';
  completedAt?: Date;
}

const DealSchema = new Schema<IDeal>({
  propertyId: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
  leadId: { type: Schema.Types.ObjectId, ref: 'Lead', required: true },
  brokerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  propertyPrice: { type: Number, required: true },
  commissionPercentage: { type: Number, required: true },
  estimatedCommission: { type: Number, required: true },
  status: {
    type: String,
    enum: ['NEGOTIATION', 'TOKEN_RECEIVED', 'COMPLETED', 'LOST'],
    default: 'NEGOTIATION'
  },
  completedAt: { type: Date }
}, { timestamps: true });

export const Deal = mongoose.model<IDeal>('Deal', DealSchema);
