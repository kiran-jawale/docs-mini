import mongoose, { Schema } from 'mongoose';

const noticeSchema = new Schema({
  title: { type: String, required: true, trim: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['info', 'alert', 'success'], default: 'info' },
  createdBy: { type: Schema.Types.ObjectId, ref: 'Employee', required: true }
}, { timestamps: true });

export const Notice = mongoose.model('Notice', noticeSchema);