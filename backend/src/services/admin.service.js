import { User } from "../models/user.model.js";
import { Employee } from "../models/employee.model.js";
import { ApiError } from "../utils/ApiError.js";
import { UX_ERRORS } from "../constants/uxErrors.js";

class AdminService {
  async getAllAccounts(type, filters = {}) {
    const Model = type === "employee" ? Employee : User;
    return await Model.find(filters).select("-password -refreshToken").sort({ createdAt: -1 });
  }

  async getAccountById(id, type) {
    const Model = type === "employee" ? Employee : User;
    const account = await Model.findById(id).select("-password -refreshToken");
    if (!account) throw new ApiError(404, UX_ERRORS.CRUD.NOT_FOUND);
    return account;
  }

  async createEmployee(data) {
    const { email, password, role, ...rest } = data;
    
    const existingEmp = await Employee.findOne({ email });
    if (existingEmp) throw new ApiError(409, UX_ERRORS.AUTH.ALREADY_EXISTS);

    const empCode = `${role.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const employee = await Employee.create({
      email, password, role, empCode, ...rest
    });

    const result = employee.toObject();
    delete result.password;
    delete result.refreshToken;
    return result;
  }

  async updateEmployee(id, updateData, requesterRole, requesterId) {
    if (id.toString() === requesterId.toString() && updateData.status) {
      throw new ApiError(403, "Action blocked. You cannot alter your own status.");
    }

    const targetEmployee = await Employee.findById(id);
    if (!targetEmployee) throw new ApiError(404, UX_ERRORS.CRUD.NOT_FOUND);

    if (requesterRole !== "admin" && targetEmployee.role === "admin") {
      throw new ApiError(403, UX_ERRORS.CRUD.HIERARCHY_VIOLATION);
    }

    if (updateData.status && !['active', 'disabled'].includes(updateData.status)) {
      throw new ApiError(400, "Employee status must be 'active' or 'disabled'.");
    }

    delete updateData.password;
    delete updateData.email;
    delete updateData.empCode;
    delete updateData.role; 

    const updated = await Employee.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password -refreshToken");

    return updated;
  }

  async deleteAccount(targetId, targetType, requesterRole, requesterId) {
    if (targetId.toString() === requesterId.toString()) {
      throw new ApiError(403, UX_ERRORS.CRUD.SELF_DELETE);
    }

    const Model = targetType === "employee" ? Employee : User;
    const targetAccount = await Model.findById(targetId);
    
    if (!targetAccount) throw new ApiError(404, UX_ERRORS.CRUD.NOT_FOUND);

    if (targetType === "employee") {
      const targetRole = targetAccount.role;
      if (requesterRole === "hr" && (targetRole === "admin" || targetRole === "hr")) {
        throw new ApiError(403, UX_ERRORS.CRUD.HIERARCHY_VIOLATION);
      }
      if (requesterRole === "admin" && targetRole === "admin") {
        throw new ApiError(403, UX_ERRORS.CRUD.HIERARCHY_VIOLATION);
      }
      if (requesterRole === "mod") {
        throw new ApiError(403, UX_ERRORS.CRUD.HIERARCHY_VIOLATION);
      }
    } else {
      if (requesterRole === "mod") {
        throw new ApiError(403, UX_ERRORS.CRUD.HIERARCHY_VIOLATION);
      }
    }

    await Model.findByIdAndDelete(targetId);
    return true;
  }

  async updateAccountStatus(targetId, targetType, newStatus, requesterRole, requesterId) {
    if (targetId.toString() === requesterId.toString()) {
      throw new ApiError(403, "Action blocked. You cannot alter your own active status.");
    }

    const Model = targetType === "employee" ? Employee : User;
    const targetAccount = await Model.findById(targetId);
    
    if (!targetAccount) throw new ApiError(404, UX_ERRORS.CRUD.NOT_FOUND);

    if (targetType === "employee") {
      if (!['active', 'disabled'].includes(newStatus)) {
        throw new ApiError(400, "Employee status must be 'active' or 'disabled'.");
      }
      
      const targetRole = targetAccount.role;
      if (requesterRole === "hr" && (targetRole === "admin" || targetRole === "hr")) {
        throw new ApiError(403, UX_ERRORS.CRUD.HIERARCHY_VIOLATION);
      }
      if (requesterRole === "admin" && targetRole === "admin") {
        throw new ApiError(403, UX_ERRORS.CRUD.HIERARCHY_VIOLATION);
      }
      if (requesterRole === "mod") {
        throw new ApiError(403, UX_ERRORS.CRUD.HIERARCHY_VIOLATION);
      }
    } else {
      if (!['active', 'restricted', 'blocked', 'disabled'].includes(newStatus)) {
        throw new ApiError(400, "Invalid status for citizen account.");
      }
    }

    targetAccount.status = newStatus;
    await targetAccount.save({ validateBeforeSave: false });
    
    const result = targetAccount.toObject();
    delete result.password;
    return result;
  }
}

export default new AdminService();