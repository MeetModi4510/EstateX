import mongoose, { Document, Schema } from 'mongoose';

export interface IAdminActivityLog extends Document {
  adminId: mongoose.Types.ObjectId;
  action: string;
  targetType: string;
  targetId?: mongoose.Types.ObjectId | string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const AdminActivityLogSchema = new Schema<IAdminActivityLog>({
  adminId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true },
  targetType: { type: String, required: true },
  targetId: { type: Schema.Types.Mixed },
  description: { type: String, required: true }
}, { timestamps: true });

export const AdminActivityLog = mongoose.model<IAdminActivityLog>('AdminActivityLog', AdminActivityLogSchema);
