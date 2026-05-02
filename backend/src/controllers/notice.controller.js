import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Notice } from "../models/notice.model.js";
import { UX_ERRORS } from "../constants/uxErrors.js";

export const createNotice = asyncHandler(async (req, res) => {
  const { title, message, type } = req.body;
  if (!title || !message) throw new ApiError(400, UX_ERRORS.VALIDATION.MISSING_FIELDS);

  const notice = await Notice.create({
    title, message, type, createdBy: req.user._id
  });

  return res.status(201).json(new ApiResponse(201, notice, "Notice published successfully"));
});

export const getActiveNotices = asyncHandler(async (req, res) => {
  const notices = await Notice.find().sort({ createdAt: -1 }).limit(20);
  return res.status(200).json(new ApiResponse(200, notices, "Notices fetched"));
});

export const deleteNotice = asyncHandler(async (req, res) => {
  const notice = await Notice.findByIdAndDelete(req.params.id);
  if (!notice) throw new ApiError(404, UX_ERRORS.CRUD.NOT_FOUND);
  return res.status(200).json(new ApiResponse(200, {}, "Notice deleted successfully"));
});