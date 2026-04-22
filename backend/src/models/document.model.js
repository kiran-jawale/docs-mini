import mongoose, { Schema } from 'mongoose';

const documentSchema = new Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true, default: '' },
  cloudUrl: { type: String, required: true },       // secure_url from Cloudinary
  cloudPublicId: { type: String, required: true },  // public_id for deletion
  fileType: { 
    type: String, 
    required: true,
    enum: [
      'application/pdf', 'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel', 
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint', 
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/json',
      'text/plain', 'image/jpeg', 'image/png', 'image/jpg'
    ]
  },
  fileSize: { type: Number, required: true },
  isPublic: { type: Boolean, default: false },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
}, { timestamps: true });

export const Document = mongoose.model('Document', documentSchema);