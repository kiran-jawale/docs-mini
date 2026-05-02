import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import authService from "../services/auth.service.js";
import { UX_ERRORS } from "../constants/uxErrors.js";
import { COOKIE_OPTIONS } from "../constants.js";

export const registerUser = asyncHandler(async (req, res) => {
  const createdAccount = await authService.register(req.body);
  return res.status(201).json(new ApiResponse(201, createdAccount, "Account initialized successfully."));
});

export const login = asyncHandler(async (req, res) => {
  const { identifier, password } = req.body;
  
  if (!identifier || !password) {
    throw new ApiError(400, UX_ERRORS.VALIDATION.MISSING_FIELDS);
  }

  const { user, type, accessToken, refreshToken } = await authService.authenticate(identifier, password);

  return res.status(200)
    .cookie("accessToken", accessToken, COOKIE_OPTIONS)
    .cookie("refreshToken", refreshToken, COOKIE_OPTIONS)
    .json(new ApiResponse(200, { user, type }, "Authentication successful."));
});

export const logout = asyncHandler(async (req, res) => {
  await authService.clearRefreshToken(req.user._id, req.userType);
  return res.status(200)
    .clearCookie("accessToken", COOKIE_OPTIONS)
    .clearCookie("refreshToken", COOKIE_OPTIONS)
    .json(new ApiResponse(200, {}, "Logged out successfully."));
});

export const getMyProfile = asyncHandler(async (req, res) => {
  return res.status(200).json(new ApiResponse(200, { user: req.user, type: req.userType }, "Profile verified."));
});

export const updateProfile = asyncHandler(async (req, res) => {
  const updated = await authService.updateProfile(req.user._id, req.userType === "employee", req.body);
  return res.status(200).json(new ApiResponse(200, updated, "Profile data updated."));
});

export const updateEmail = asyncHandler(async (req, res) => {
  if (!req.body.email) throw new ApiError(400, UX_ERRORS.VALIDATION.MISSING_FIELDS);
  const updated = await authService.updateEmail(req.user._id, req.userType === "employee", req.body.email);
  return res.status(200).json(new ApiResponse(200, updated, "Email binding updated."));
});

export const updateUserID = asyncHandler(async (req, res) => {
  if (!req.body.newUserID) throw new ApiError(400, UX_ERRORS.VALIDATION.MISSING_FIELDS);
  const updated = await authService.updateUserID(req.user._id, req.userType === "employee", req.body.newUserID);
  return res.status(200).json(new ApiResponse(200, updated, "User ID assignment successful."));
});

export const changePassword = asyncHandler(async (req, res) => {
  if (!req.body.oldPassword || !req.body.newPassword) {
    throw new ApiError(400, UX_ERRORS.VALIDATION.MISSING_FIELDS);
  }
  await authService.changePassword(req.user._id, req.userType === "employee", req.body.oldPassword, req.body.newPassword);
  return res.status(200).json(new ApiResponse(200, {}, "Security credentials updated."));
});