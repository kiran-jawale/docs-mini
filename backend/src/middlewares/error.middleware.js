import { ApiError } from "../utils/ApiError.js";

const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  // The discriminator: Only log actual system crashes (500s) to the terminal.
  // This keeps the terminal 100% silent when a user makes a typo.
  if (!(err instanceof ApiError)) {
    console.error(`[SYSTEM CRASH] 🚨\n${err.stack}`);
  }

  // Format the JSON strictly so the frontend interceptor can read 'message'
  return res.status(statusCode).json({
    success: false,
    message: message
  });
};

export default errorMiddleware;