import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { Document } from "../models/document.model.js";

const modGetAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password");
  return res.status(200).json(new ApiResponse(200, users, "Users fetched"));
});

const modGetUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) throw new ApiError(404, "User not found");
  return res.status(200).json(new ApiResponse(200, user, "User details"));
});

const updateUserStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const userId = req.params.id;

  const targetUser = await User.findById(userId);
  if (!targetUser) throw new ApiError(404, "User not found");

  // Rule: Mods cannot modify Admins
  if (targetUser.role === "admin") {
    throw new ApiError(403, "Moderators cannot modify Administrators");
  }

  targetUser.status = status;
  await targetUser.save({ validateBeforeSave: false });

  return res.status(200).json(new ApiResponse(200, targetUser, "User status updated"));
});

const modGetAllPublicDocuments = asyncHandler(async (req, res) => {
  const docs = await Document.find({ isPublic: true }).populate("owner", "fullname email");
  return res.status(200).json(new ApiResponse(200, docs, "Public documents fetched"));
});

// Mods can toggle visibility but NOT delete documents (per prompt)
const toggleDocumentVisibility = asyncHandler(async (req, res) => {
  const document = await Document.findById(req.params.id);
  if (!document) throw new ApiError(404, "Document not found");

  // Mods manage public docs.
  document.isPublic = !document.isPublic;
  await document.save();

  return res.status(200).json(new ApiResponse(200, document, "Visibility toggled"));
});

export {
  modGetAllUsers,
  modGetUserById,
  updateUserStatus,
  modGetAllPublicDocuments,
  toggleDocumentVisibility
};