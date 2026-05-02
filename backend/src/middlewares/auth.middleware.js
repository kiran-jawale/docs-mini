import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { Employee } from "../models/employee.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { UX_ERRORS } from "../constants/uxErrors.js"; // USING NEW CONSTANTS

export const isVerified = asyncHandler(async (req, res, next) => {
  try {
    // 1. Extract Token
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, UX_ERRORS.AUTH.SESSION_EXPIRED);
    }

    // 2. Verify Token
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // 3. Find Account (Dual Identity Check)
    let account = null;
    if (decodedToken.type === "employee") {
      account = await Employee.findById(decodedToken._id).select("-password -refreshToken");
    } else {
      account = await User.findById(decodedToken._id).select("-password -refreshToken");
    }

    if (!account) {
      throw new ApiError(401, UX_ERRORS.AUTH.SESSION_EXPIRED);
    }

    // 4. Critical Security Check: Was the account disabled while the token was active?
    if (account.status === "disabled" || account.status === "blocked") {
      throw new ApiError(403, UX_ERRORS.AUTH.DISABLED);
    }

    // 5. Attach to request and proceed
    req.user = account;
    req.userType = decodedToken.type;
    next();
    
  } catch (error) {
    // Catch JWT-specific errors (like TokenExpiredError) and cast them to our standard UX error
    if (error.name === "TokenExpiredError" || error.name === "JsonWebTokenError") {
      throw new ApiError(401, UX_ERRORS.AUTH.SESSION_EXPIRED);
    }
    // Pass any other ApiErrors straight through to the errorMiddleware
    throw error;
  }
});