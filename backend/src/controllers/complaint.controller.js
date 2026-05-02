import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import complaintService from "../services/complaint.service.js";
import { UX_ERRORS } from "../constants/uxErrors.js";

export const createComplaint = asyncHandler(async (req, res) => {
  const { subject, description } = req.body;

  if (!subject?.trim() || !description?.trim()) {
    throw new ApiError(400, UX_ERRORS.COMPLAINT.REQ_FIELDS);
  }

  const complaint = await complaintService.createComplaint(
    { subject, description },
    req.files, 
    req.user._id
  );

  return res.status(201).json(new ApiResponse(201, complaint, "Ticket raised successfully"));
});

export const getMyComplaints = asyncHandler(async (req, res) => {
  const complaints = await complaintService.getUserComplaints(req.user._id);
  return res.status(200).json(new ApiResponse(200, complaints, "Complaints fetched"));
});

export const getAllComplaints = asyncHandler(async (req, res) => {
  const { status } = req.query; 
  const complaints = await complaintService.getAllComplaints(status);
  return res.status(200).json(new ApiResponse(200, complaints, "All complaints fetched"));
});

export const updateComplaintStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!["pending", "in-progress", "resolved"].includes(status)) {
    throw new ApiError(400, UX_ERRORS.VALIDATION.INVALID_INPUT);
  }

  const updatedComplaint = await complaintService.updateComplaintStatus(req.params.id, status, req.user._id);
  return res.status(200).json(new ApiResponse(200, updatedComplaint, "Complaint status updated"));
});

export const deleteComplaint = asyncHandler(async (req, res) => {
  await complaintService.deleteComplaint(req.params.id);
  return res.status(200).json(new ApiResponse(200, {}, "Complaint deleted successfully"));
});