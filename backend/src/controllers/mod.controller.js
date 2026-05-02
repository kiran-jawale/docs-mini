import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import adminService from "../services/admin.service.js";
import documentService from "../services/document.service.js";
import { Document } from "../models/document.model.js";
import { UX_ERRORS } from "../constants/uxErrors.js";

export const modGetAllUsers = asyncHandler(async (req, res) => {
  const users = await adminService.getAllAccounts("user", req.query);
  return res.status(200).json(new ApiResponse(200, users, "Users fetched"));
});

export const modGetUserById = asyncHandler(async (req, res) => {
  const user = await adminService.getAccountById(req.params.id, "user");
  return res.status(200).json(new ApiResponse(200, user, "User details fetched"));
});

export const updateUserStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!status) throw new ApiError(400, UX_ERRORS.VALIDATION.MISSING_FIELDS);

  const updatedUser = await adminService.updateAccountStatus(req.params.id, "user", status, req.user.role, req.user._id);
  return res.status(200).json(new ApiResponse(200, updatedUser, "User status updated"));
});

export const modGetAllPublicDocuments = asyncHandler(async (req, res) => {
  const docs = await documentService.getPublicDocuments();
  return res.status(200).json(new ApiResponse(200, docs, "Public documents fetched"));
});

// src/controllers/mod.controller.js
export const toggleDocumentVisibility = asyncHandler(async (req, res) => {
  // Logic moved to service to ensure consistent permission checks
  const document = await documentService.toggleVisibility(req.params.id, req.user);
  
  return res.status(200).json(
    new ApiResponse(200, document, `Document visibility updated.`)
  );
});