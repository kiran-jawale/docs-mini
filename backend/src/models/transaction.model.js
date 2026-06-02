import mongoose, { Schema } from 'mongoose';

const transactionSchema = new Schema(
  {
    amount: { type: Number, required: true },
    
    type: {
      type: String,
      required: true,
      enum: ['Income', 'Expense', 'Payroll'],
    },

    date: { type: Date, default: Date.now },
    
    description: { type: String, required: true, trim: true },

    recipientEmployee: { type: Schema.Types.ObjectId, ref: 'Employee' },

    processedBy: {
      type: Schema.Types.ObjectId,
      ref: 'Employee',
      required: true,
    },
  },
  { timestamps: true }
);

export const Transaction = mongoose.model('Transaction', transactionSchema);
