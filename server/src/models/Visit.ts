import mongoose, { Document, Schema } from 'mongoose';

export interface IVisit extends Document {
  leadId: mongoose.Types.ObjectId;
  propertyId: mongoose.Types.ObjectId;
  brokerId: mongoose.Types.ObjectId;
  scheduledDate: Date;
  scheduledTime: string;
  status: 'REQUESTED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED';
  notes?: string;
  createdAt: Date;
}

const VisitSchema = new Schema<IVisit>({
  leadId: { type: Schema.Types.ObjectId, ref: 'Lead', required: true },
  propertyId: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
  brokerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  scheduledDate: { type: Date, required: true },
  scheduledTime: { type: String, required: true },
  status: {
    type: String,
    enum: ['REQUESTED', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'RESCHEDULED'],
    default: 'REQUESTED'
  },
  notes: { type: String }
}, { timestamps: { createdAt: true, updatedAt: false } });

export const Visit = mongoose.model<IVisit>('Visit', VisitSchema);
