import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import authService from "../services/auth.service.js";

export const registerUser = asyncHandler(async (req, res) => {
  const { fullname, email, password, contact, address, areacode } = req.body;

  if (!fullname?.trim() || !email?.trim() || !password?.trim()) {
    throw new ApiError(400, "Fullname, email, and password are required");
  }

  const createdUser = await authService.registerCustomer({
    fullname,
    email,
    password,
    contact,
    address,
    areacode,
  });

  return res.status(201).json(new ApiResponse(201, createdUser, "User registered successfully"));
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email?.trim() || !password?.trim()) {
    throw new ApiError(400, "Email and password are required");
  }

  const { account, accessToken, refreshToken, type } = await authService.authenticate(email, password);

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: account, type, accessToken, refreshToken },
        "Logged in successfully"
      )
    );
});

export const logout = asyncHandler(async (req, res) => {
  // Determine if req.user is an Employee or Customer and clear refresh token
  await authService.clearRefreshToken(req.user._id, req.user.role ? "employee" : "user");

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "Logged out successfully"));
});

export const getMyProfile = asyncHandler(async (req, res) => {
  return res.status(200).json(new ApiResponse(200, req.user, "Profile fetched successfully"));
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { fullname, contact, address, areacode } = req.body;
  const isEmployee = !!req.user.role; // Employees have a role, Customers do not in the new schema

  const updatedProfile = await authService.updateProfile(req.user._id, isEmployee, {
    fullname,
    contact,
    address,
    areacode,
  });

  return res.status(200).json(new ApiResponse(200, updatedProfile, "Profile updated successfully"));
});

export const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new ApiError(400, "Old password and new password are required");
  }

  const isEmployee = !!req.user.role;
  await authService.changePassword(req.user._id, isEmployee, oldPassword, newPassword);

  return res.status(200).json(new ApiResponse(200, {}, "Password changed successfully"));
});