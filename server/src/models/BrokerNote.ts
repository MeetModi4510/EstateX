import mongoose, { Document, Schema } from 'mongoose';

export interface IBrokerNote extends Document {
  brokerId: mongoose.Types.ObjectId;
  leadId: mongoose.Types.ObjectId;
  propertyId: mongoose.Types.ObjectId;
  note: string;
  createdAt: Date;
  updatedAt: Date;
}

const BrokerNoteSchema = new Schema<IBrokerNote>({
  brokerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  leadId: { type: Schema.Types.ObjectId, ref: 'Lead', required: true },
  propertyId: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
  note: { type: String, required: true }
}, { timestamps: true });

export const BrokerNote = mongoose.model<IBrokerNote>('BrokerNote', BrokerNoteSchema);
