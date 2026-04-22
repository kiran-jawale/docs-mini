import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { Employee } from "../models/employee.model.js";

export const isVerified = asyncHandler(async (req, _, next) => {
  try {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    if (!token) throw new ApiError(401, "Unauthorized request");

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Smart Lookup: Since IDs are unique across MongoDB, we can check Employee first, then User
    let account = await Employee.findById(decodedToken?._id).select("-password -refreshToken");
    let type = "employee";

    if (!account) {
      account = await User.findById(decodedToken?._id).select("-password -refreshToken");
      type = "user";
    }

    if (!account) throw new ApiError(401, "Invalid Access Token");

    if (account.status === "disabled") {
      throw new ApiError(403, "Account disabled by administration.");
    }

    req.user = account;
    req.userType = type; // Attach type so controllers know if it's a customer or staff
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});