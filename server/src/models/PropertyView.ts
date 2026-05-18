import mongoose, { Document, Schema } from 'mongoose';

export interface IPropertyView extends Document {
  propertyId: mongoose.Types.ObjectId;
  ownerId: mongoose.Types.ObjectId;
  viewerIp: string;
  createdAt: Date;
}

const PropertyViewSchema = new Schema<IPropertyView>({
  propertyId: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
  ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  viewerIp: { type: String, required: true }
}, {
  timestamps: true // adds createdAt
});

PropertyViewSchema.index({ ownerId: 1, createdAt: 1 });
PropertyViewSchema.index({ propertyId: 1, createdAt: 1 });

export const PropertyView = mongoose.model<IPropertyView>('PropertyView', PropertyViewSchema);
