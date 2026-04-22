import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import documentService from "../services/document.service.js";
import { Document } from "../models/document.model.js";

export const uploadDocument = asyncHandler(async (req, res) => {
  const { title, description, isPublic } = req.body;
  if (!req.file) throw new ApiError(400, "Document file is required");

  const document = await documentService.uploadDocument({ title, description, isPublic }, req.file, req.user);
  return res.status(201).json(new ApiResponse(201, document, "Document uploaded successfully"));
});

export const getMyDocuments = asyncHandler(async (req, res) => {
  const documents = await documentService.getDocumentsByOwner(req.user._id);
  return res.status(200).json(new ApiResponse(200, documents, "Documents fetched successfully"));
});

export const getPublicDocuments = asyncHandler(async (req, res) => {
  if (req.user.status === "blocked" || req.user.status === "disabled") {
    throw new ApiError(403, "Your account status prevents access to public documents");
  }
  const documents = await documentService.getPublicDocuments();
  return res.status(200).json(new ApiResponse(200, documents, "Public documents fetched"));
});

export const updateDocument = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  const document = await documentService.updateDocument(req.params.id, req.user, { title, description });
  return res.status(200).json(new ApiResponse(200, document, "Document updated successfully"));
});

export const deleteDocument = asyncHandler(async (req, res) => {
  await documentService.deleteDocument(req.params.id, req.user);
  return res.status(200).json(new ApiResponse(200, {}, "Document deleted successfully"));
});

// --- NEW: CLOUDINARY DOWNLOAD CONTROLLER ---
export const downloadDocument = asyncHandler(async (req, res) => {
  const document = await Document.findById(req.params.id);
  if (!document) throw new ApiError(404, "Document not found");

  // Permission Verification
  const isOwner = document.owner.toString() === req.user._id.toString();
  const isAdminOrMod = ["admin", "mod"].includes(req.user.role);

  if (!isOwner && !isAdminOrMod) {
    if (!document.isPublic) throw new ApiError(403, "Access denied");
    if (["restricted", "blocked"].includes(req.user.status)) {
      throw new ApiError(403, "Your account status prevents downloading public files");
    }
  }

  // Cloudinary Force-Download Trick:
  // We take the standard URL (e.g., https://res.cloudinary.com/demo/image/upload/v1234/file.pdf)
  // And inject 'fl_attachment' to force the browser download prompt.
  const urlParts = document.cloudUrl.split('/upload/');
  if (urlParts.length !== 2) throw new ApiError(500, "Invalid Cloudinary URL structure");
  
  const downloadUrl = `${urlParts[0]}/upload/fl_attachment/${urlParts[1]}`;

  // Redirecting the backend route pushes the user's browser to the Cloudinary attachment link
  return res.redirect(downloadUrl);
});