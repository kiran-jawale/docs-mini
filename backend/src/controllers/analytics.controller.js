import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import analyticsService from "../services/analytics.service.js";

export const getUserAnalytics = asyncHandler(async (req, res) => {
  const data = await analyticsService.getFilteredUserMetrics(req.query);
  return res.status(200).json(new ApiResponse(200, data, "User analytics fetched"));
});

export const getDocAnalytics = asyncHandler(async (req, res) => {
  const data = await analyticsService.getFilteredDocMetrics(req.query);
  return res.status(200).json(new ApiResponse(200, data[0], "Doc analytics fetched"));
});

export const getComplaintAnalytics = asyncHandler(async (req, res) => {
  const data = await analyticsService.getFilteredComplaintMetrics(req.query);
  return res.status(200).json(new ApiResponse(200, data, "Complaint analytics fetched"));
});