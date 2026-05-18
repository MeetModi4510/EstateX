import mongoose, { Document, Schema } from 'mongoose';

export interface IPropertyImage extends Document {
  propertyId: mongoose.Types.ObjectId;
  imageUrl: string;
  publicId: string;
  isCover: boolean;
  displayOrder: number;
  createdAt: Date;
}

const PropertyImageSchema = new Schema<IPropertyImage>({
  propertyId: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
  imageUrl: { type: String, required: true },
  publicId: { type: String, required: true },
  isCover: { type: Boolean, default: false },
  displayOrder: { type: Number, default: 0 }
}, { timestamps: { createdAt: true, updatedAt: false } });

export const PropertyImage = mongoose.model<IPropertyImage>('PropertyImage', PropertyImageSchema);
