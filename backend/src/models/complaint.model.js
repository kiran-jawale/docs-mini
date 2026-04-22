import mongoose, { Schema } from 'mongoose';

const complaintSchema = new Schema({
  subject: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  images: [{ 
    url: String, 
    publicId: String 
  }],
  raisedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  assignedTo: { type: Schema.Types.ObjectId, ref: 'Employee' },
  status: { type: String, enum: ['pending', 'in-progress', 'resolved'], default: 'pending' },
}, { timestamps: true });

export const Complaint = mongoose.model('Complaint', complaintSchema);