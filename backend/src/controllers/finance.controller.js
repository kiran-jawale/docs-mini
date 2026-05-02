import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import financeService from "../services/finance.service.js";
import { UX_ERRORS } from "../constants/uxErrors.js";

export const createTransaction = asyncHandler(async (req, res) => {
  const { amount, type, description, recipientEmployee } = req.body;
  if (!amount || !type || !description) throw new ApiError(400, UX_ERRORS.FINANCE.REQ_FIELDS);
  if (!['Income', 'Expense', 'Payroll'].includes(type)) throw new ApiError(400, UX_ERRORS.FINANCE.INVALID_TYPE);
  if (type === 'Payroll' && !recipientEmployee) throw new ApiError(400, UX_ERRORS.FINANCE.PAYROLL_REQ_EMP);

  const transaction = await financeService.createTransaction({
    amount, type, description, recipientEmployee, processedBy: req.user._id
  });

  return res.status(201).json(new ApiResponse(201, transaction, "Transaction recorded"));
});

export const getAllTransactions = asyncHandler(async (req, res) => {
  const transactions = await financeService.getAllTransactions();
  return res.status(200).json(new ApiResponse(200, transactions, "Transactions fetched"));
});

export const getPayrollTransactions = asyncHandler(async (req, res) => {
  const payrolls = await financeService.getPayrollTransactions();
  return res.status(200).json(new ApiResponse(200, payrolls, "Payroll records fetched"));
});