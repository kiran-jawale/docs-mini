import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import adminService from "../services/admin.service.js";

// --- EMPLOYEE MANAGEMENT ---

export const createEmployee = asyncHandler(async (req, res) => {
  const { empCode, fullname, email, password, dept, role } = req.body;

  if (!empCode || !fullname || !email || !password || !role) {
    throw new ApiError(400, "Missing required employee fields");
  }

  const newEmployee = await adminService.createEmployee({
    empCode, fullname, email, password, dept, role
  });

  return res.status(201).json(new ApiResponse(201, newEmployee, "Employee created successfully"));
});

export const getAllEmployees = asyncHandler(async (req, res) => {
  const employees = await adminService.getAllEmployees(req.user._id);
  return res.status(200).json(new ApiResponse(200, employees, "Employees fetched successfully"));
});

export const getEmployeeById = asyncHandler(async (req, res) => {
  const employee = await adminService.getEmployeeById(req.params.id);
  return res.status(200).json(new ApiResponse(200, employee, "Employee fetched successfully"));
});

export const updateEmployee = asyncHandler(async (req, res) => {
  const { fullname, dept, role, status } = req.body;
  
  if (req.params.id === req.user._id.toString() && role && role !== 'admin') {
    throw new ApiError(403, "You cannot demote yourself");
  }

  const updatedEmployee = await adminService.updateEmployee(req.params.id, { fullname, dept, role, status });
  return res.status(200).json(new ApiResponse(200, updatedEmployee, "Employee updated successfully"));
});

export const deleteEmployee = asyncHandler(async (req, res) => {
  if (req.params.id === req.user._id.toString()) {
    throw new ApiError(403, "You cannot delete your own account");
  }
  
  await adminService.deleteEmployee(req.params.id);
  return res.status(200).json(new ApiResponse(200, {}, "Employee deleted successfully"));
});

// --- USER (CUSTOMER) MANAGEMENT ---

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await adminService.getAllUsers();
  return res.status(200).json(new ApiResponse(200, users, "Users fetched successfully"));
});

export const getUserById = asyncHandler(async (req, res) => {
  const user = await adminService.getUserById(req.params.id);
  return res.status(200).json(new ApiResponse(200, user, "User fetched successfully"));
});

export const updateUserStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!['active', 'restricted', 'blocked', 'disabled'].includes(status)) {
    throw new ApiError(400, "Invalid status provided");
  }

  const updatedUser = await adminService.updateUserStatus(req.params.id, status);
  return res.status(200).json(new ApiResponse(200, updatedUser, "User status updated successfully"));
});

export const deleteUser = asyncHandler(async (req, res) => {
  await adminService.deleteUserAndAssets(req.params.id);
  return res.status(200).json(new ApiResponse(200, {}, "User and associated documents deleted successfully"));
});