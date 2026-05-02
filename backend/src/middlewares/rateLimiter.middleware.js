import { rateLimit } from 'express-rate-limit';
import { ApiError } from "../utils/ApiError.js";

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 10, // Limit each IP to 10 login/register attempts per window
  handler: (req, res, next) => {
    // Push the error into the global error handler
    next(new ApiError(429, "Too many attempts from this IP, please try again after 15 minutes."));
  },
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});

export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  limit: 20, // Max 20 uploads per hour
  handler: (req, res, next) => {
    // Push the error into the global error handler
    next(new ApiError(429, "Upload limit reached. Try again later."));
  },
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});