import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import complaintService from "../services/complaint.service.js";

export const createComplaint = asyncHandler(async (req, res) => {
  const { subject, description } = req.body;

  if (!subject?.trim() || !description?.trim()) {
    throw new ApiError(400, "Subject and description are required");
  }

  const complaint = await complaintService.createComplaint(
    { subject, description },
    req.files, // Multer array of files
    req.user._id
  );

  return res.status(201).json(new ApiResponse(201, complaint, "Complaint raised successfully"));
});

export const getMyComplaints = asyncHandler(async (req, res) => {
  const complaints = await complaintService.getUserComplaints(req.user._id);
  return res.status(200).json(new ApiResponse(200, complaints, "Complaints fetched successfully"));
});

export const getAllComplaints = asyncHandler(async (req, res) => {
  const { status } = req.query; // Optional filter
  const complaints = await complaintService.getAllComplaints(status);
  return res.status(200).json(new ApiResponse(200, complaints, "All complaints fetched successfully"));
});

export const updateComplaintStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!["pending", "in-progress", "resolved"].includes(status)) {
    throw new ApiError(400, "Invalid status");
  }

  // Pass req.user._id to track which employee resolved it
  const updatedComplaint = await complaintService.updateComplaintStatus(req.params.id, status, req.user._id);
  return res.status(200).json(new ApiResponse(200, updatedComplaint, "Complaint status updated"));
});

export const deleteComplaint = asyncHandler(async (req, res) => {
  await complaintService.deleteComplaint(req.params.id);
  return res.status(200).json(new ApiResponse(200, {}, "Complaint deleted successfully"));
});