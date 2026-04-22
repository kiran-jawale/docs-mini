import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';

const employeeSchema = new Schema({
  empCode: { type: String, required: true, unique: true, uppercase: true },
  fullname: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  dept: { type: String, enum: ['Helpdesk', 'Noticeboard', 'HR', 'General'], default: 'General' },
  role: { type: String, enum: ['mod', 'admin', 'hr'], required: true },
  status: { type: String, enum: ['active', 'disabled'], default: 'active' },
  contact: { type: String, default: '' },
  address: { type: String, default: '' },
}, { timestamps: true });

employeeSchema.pre('save', async function (next) { /* bcrypt logic */ next(); });
employeeSchema.methods.comparePassword = async function (password) { /* bcrypt logic */ };

export const Employee = mongoose.model('Employee', employeeSchema);