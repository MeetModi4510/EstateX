import mongoose, { Document, Schema } from 'mongoose';

export interface IPropertyAmenity extends Document {
  propertyId: mongoose.Types.ObjectId;
  amenityName: string;
}

const PropertyAmenitySchema = new Schema<IPropertyAmenity>({
  propertyId: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
  amenityName: { type: String, required: true }
});

export const PropertyAmenity = mongoose.model<IPropertyAmenity>('PropertyAmenity', PropertyAmenitySchema);
