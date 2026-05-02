import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import adminService from "../services/admin.service.js";
import { UX_ERRORS } from "../constants/uxErrors.js";

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await adminService.getAllAccounts("user", req.query);
  return res.status(200).json(new ApiResponse(200, users, "Users retrieved successfully."));
});

export const getUserById = asyncHandler(async (req, res) => {
  const user = await adminService.getAccountById(req.params.id, "user");
  return res.status(200).json(new ApiResponse(200, user, "User details retrieved."));
});

export const updateUserStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!status) throw new ApiError(400, UX_ERRORS.VALIDATION.MISSING_FIELDS);
  
  const updatedUser = await adminService.updateAccountStatus(req.params.id, "user", status, req.user.role, req.user._id);
  return res.status(200).json(new ApiResponse(200, updatedUser, `User status updated to ${status}.`));
});

export const deleteUser = asyncHandler(async (req, res) => {
  await adminService.deleteAccount(req.params.id, "user", req.user.role, req.user._id);
  return res.status(200).json(new ApiResponse(200, {}, "User securely deleted."));
});

export const createEmployee = asyncHandler(async (req, res) => {
  const employee = await adminService.createEmployee(req.body);
  return res.status(201).json(new ApiResponse(201, employee, "Employee created successfully."));
});

export const getAllEmployees = asyncHandler(async (req, res) => {
  const employees = await adminService.getAllAccounts("employee", req.query);
  return res.status(200).json(new ApiResponse(200, employees, "Employees retrieved successfully."));
});

export const getEmployeeById = asyncHandler(async (req, res) => {
  const employee = await adminService.getAccountById(req.params.id, "employee");
  return res.status(200).json(new ApiResponse(200, employee, "Employee details retrieved."));
});

export const updateEmployee = asyncHandler(async (req, res) => {
  const updatedEmployee = await adminService.updateEmployee(req.params.id, req.body, req.user.role, req.user._id);
  return res.status(200).json(new ApiResponse(200, updatedEmployee, "Employee updated successfully."));
});