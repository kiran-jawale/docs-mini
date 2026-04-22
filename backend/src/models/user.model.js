import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new Schema({
  fullname: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  status: {
    type: String,
    enum: ['active', 'restricted', 'blocked', 'disabled'],
    default: 'active',
  },
  contact: { type: String, default: '' },
  address: { type: String, default: '' },
}, { timestamps: true });

userSchema.pre('save', async function (next) { /* bcrypt logic */ next(); });
userSchema.methods.comparePassword = async function (password) { /* bcrypt logic */ };

export const User = mongoose.model('User', userSchema);