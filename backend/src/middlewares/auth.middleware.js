import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { Employee } from "../models/employee.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { UX_ERRORS } from "../constants/uxErrors.js";

export const isVerified = asyncHandler(async (req, res, next) => {
  try {
    // extract Token
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, UX_ERRORS.AUTH.SESSION_EXPIRED);
    }

    // verify Token
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // idenity Acc
    let account = null;
    if (decodedToken.type === "employee") {
      account = await Employee.findById(decodedToken._id).select("-password -refreshToken");
    } else {
      account = await User.findById(decodedToken._id).select("-password -refreshToken");
    }

    if (!account) {
      throw new ApiError(401, UX_ERRORS.AUTH.SESSION_EXPIRED);
    }

    // check if the account disabledd
    if (account.status === "disabled" || account.status === "blocked") {
      throw new ApiError(403, UX_ERRORS.AUTH.DISABLED);
    }

    // attach to request and proceed
    req.user = account;
    req.userType = decodedToken.type;
    next();
    
  } catch (error) {
    if (error.name === "TokenExpiredError" || error.name === "JsonWebTokenError") {
      throw new ApiError(401, UX_ERRORS.AUTH.SESSION_EXPIRED);
    }
    throw error;
  }
});