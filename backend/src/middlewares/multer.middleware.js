import multer from "multer";
import path from "path";
import { ApiError } from "../utils/ApiError.js";
import { UX_ERRORS } from "../constants/uxErrors.js"; // USING NEW CONSTANTS

const storage = multer.diskStorage({
  destination: function (req, file, cb) { 
    cb(null, "./public/uploads"); 
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-powerpoint", "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "text/plain", "application/json", "image/jpeg", "image/png", "image/jpg", "image/gif"
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    // Passes our standard UX error directly to the errorMiddleware
    cb(new ApiError(400, UX_ERRORS.FILE.INVALID_TYPE), false);
  }
};

export const upload = multer({
  storage, 
  fileFilter, 
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit preserved
});