import { Transaction } from "../models/transaction.model.js";
import { Employee } from "../models/employee.model.js";
import { ApiError } from "../utils/ApiError.js";
import { UX_ERRORS } from "../constants/uxErrors.js"; // USING NEW CONSTANTS

class FinanceService {
  /**
   * Records a new financial entry.
   * Logic: If type is Payroll, it ensures the recipient exists in the Employee records.
   */
  async createTransaction(data) {
    const { amount, type, description, recipientEmployee, processedBy } = data;

    // Edge Case: If it's a Payroll transaction, verify the recipient exists
    if (type === "Payroll") {
      const employeeExists = await Employee.findById(recipientEmployee);
      if (!employeeExists) {
        throw new ApiError(404, UX_ERRORS.FINANCE.PAYROLL_REQ_EMP);
      }
    }

    const transaction = await Transaction.create({
      amount,
      type,
      description,
      recipientEmployee: type === "Payroll" ? recipientEmployee : undefined,
      processedBy,
    });

    if (!transaction) {
      throw new ApiError(500, "Failed to record transaction in the database.");
    }

    return await Transaction.findById(transaction._id)
      .populate("processedBy", "fullname empCode")
      .populate("recipientEmployee", "fullname empCode");
  }

  /**
   * For Admins: Fetches every single cent moving through the system.
   */
  async getAllTransactions() {
    return await Transaction.find()
      .populate("processedBy", "fullname empCode")
      .populate("recipientEmployee", "fullname empCode")
      .sort({ date: -1 });
  }

  /**
   * For HR: Strictly filters for 'Payroll' types only.
   * This ensures HR cannot see company income or general operational expenses.
   */
  async getPayrollTransactions() {
    return await Transaction.find({ type: "Payroll" })
      .populate("processedBy", "fullname empCode")
      .populate("recipientEmployee", "fullname empCode")
      .sort({ date: -1 });
  }

  /**
   * Optional: Deleting a record (Only if your business logic allows audit trail removal)
   */
  async deleteTransaction(id) {
    const transaction = await Transaction.findByIdAndDelete(id);
    if (!transaction) {
      // Sync: using the standard UX error for not found
      throw new ApiError(404, UX_ERRORS.CRUD.NOT_FOUND); 
    }
    return transaction;
  }
}

export default new FinanceService();