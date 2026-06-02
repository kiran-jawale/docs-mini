import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const errorMiddleware = (err, req, res, next) => {
  if (!(err instanceof ApiError)) {
    console.error(`[SYSTEM CRASH] 🚨\n${err.stack}`);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong";

  return res
    .status(statusCode)
    .json(new ApiResponse(statusCode, null, message));
};

export default errorMiddleware;