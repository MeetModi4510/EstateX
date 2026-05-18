import mongoose, { Document, Schema } from 'mongoose';

export interface IProperty extends Document {
  propertyCode: string;
  ownerId: mongoose.Types.ObjectId;
  brokerId?: mongoose.Types.ObjectId;
  title: string;
  description: string;
  propertyType: 'APARTMENT' | 'HOUSE' | 'VILLA' | 'PLOT' | 'OFFICE' | 'SHOP' | 'WAREHOUSE' | 'OTHER';
  listingType: 'SALE' | 'RENT';
  status: 'DRAFT' | 'PENDING_APPROVAL' | 'PUBLISHED' | 'REJECTED' | 'UNPUBLISHED' | 'SOLD' | 'ARCHIVED';
  price: number;
  maintenance?: number;
  negotiable: boolean;
  builtUpArea: number;
  carpetArea: number;
  bedrooms?: number;
  bathrooms?: number;
  balconies?: number;
  parking?: number;
  floor?: number;
  totalFloors?: number;
  propertyAge?: string;
  furnishing?: string;
  facing?: string;
  city: string;
  state: string;
  locality: string;
  address: string;
  latitude?: number;
  longitude?: number;
  possessionStatus?: string;
  createdAt: Date;
  updatedAt: Date;
  approvedAt?: Date;
  publishedAt?: Date;
  isFeatured: boolean;
  isVerified: boolean;
  archivedAt?: Date;
  archivedBy?: mongoose.Types.ObjectId;
}

const PropertySchema = new Schema<IProperty>({
  propertyCode: { type: String, required: true, unique: true },
  ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  brokerId: { type: Schema.Types.ObjectId, ref: 'User' },
  title: { type: String, required: function(this: any) { return this.status !== 'DRAFT'; } },
  description: { type: String, required: function(this: any) { return this.status !== 'DRAFT'; } },
  propertyType: { 
    type: String, 
    enum: ['APARTMENT', 'HOUSE', 'VILLA', 'PLOT', 'OFFICE', 'SHOP', 'WAREHOUSE', 'COMMERCIAL', 'FARMHOUSE', 'OTHER'], 
    required: function(this: any) { return this.status !== 'DRAFT'; } 
  },
  listingType: { type: String, enum: ['SALE', 'RENT'], required: function(this: any) { return this.status !== 'DRAFT'; } },
  status: { 
    type: String, 
    enum: ['DRAFT', 'PENDING_APPROVAL', 'PUBLISHED', 'REJECTED', 'UNPUBLISHED', 'SOLD', 'ARCHIVED'], 
    default: 'DRAFT' 
  },
  price: { type: Number, required: function(this: any) { return this.status !== 'DRAFT'; } },
  maintenance: { type: Number },
  negotiable: { type: Boolean, default: false },
  builtUpArea: { type: Number, required: function(this: any) { return this.status !== 'DRAFT'; } },
  carpetArea: { type: Number, required: function(this: any) { return this.status !== 'DRAFT'; } },
  bedrooms: { type: Number },
  bathrooms: { type: Number },
  balconies: { type: Number },
  parking: { type: Number },
  floor: { type: Number },
  totalFloors: { type: Number },
  propertyAge: { type: String },
  furnishing: { type: String },
  facing: { type: String },
  city: { type: String, required: function(this: any) { return this.status !== 'DRAFT'; } },
  state: { type: String, required: function(this: any) { return this.status !== 'DRAFT'; } },
  locality: { type: String, required: function(this: any) { return this.status !== 'DRAFT'; } },
  address: { type: String, required: function(this: any) { return this.status !== 'DRAFT'; } },
  latitude: { type: Number },
  longitude: { type: Number },
  possessionStatus: { type: String },
  approvedAt: { type: Date },
  publishedAt: { type: Date },
  isFeatured: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false },
  archivedAt: { type: Date },
  archivedBy: { type: Schema.Types.ObjectId, ref: 'User' }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

PropertySchema.virtual('images', {
  ref: 'PropertyImage',
  localField: '_id',
  foreignField: 'propertyId',
  options: { sort: { isCover: -1, displayOrder: 1 } }
});

// Indexes for search performance
PropertySchema.index({ status: 1, city: 1, locality: 1 });
PropertySchema.index({ status: 1, propertyType: 1, listingType: 1 });
PropertySchema.index({ status: 1, price: 1 });
PropertySchema.index({ status: 1, bedrooms: 1, bathrooms: 1 });
PropertySchema.index({ status: 1, createdAt: -1 });

export const Property = mongoose.model<IProperty>('Property', PropertySchema);
