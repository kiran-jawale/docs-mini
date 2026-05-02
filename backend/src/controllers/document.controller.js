import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import documentService from "../services/document.service.js";
import { Document } from "../models/document.model.js";
import { UX_ERRORS } from "../constants/uxErrors.js";

export const uploadDocument = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, UX_ERRORS.FILE.REQ_DOC);
  const document = await documentService.uploadDocument(req.body, req.file, req.user);
  return res.status(201).json(new ApiResponse(201, document, "Document uploaded"));
});

export const getMyDocuments = asyncHandler(async (req, res) => {
  // Use the unified feed service instead of just owner-based fetch
  const documents = await documentService.getDocumentFeed(req.user._id);
  return res.status(200).json(new ApiResponse(200, documents, "Document feed fetched"));
});

export const getPublicDocuments = asyncHandler(async (req, res) => {
  if (["blocked", "disabled"].includes(req.user.status)) throw new ApiError(403, UX_ERRORS.AUTH.FORBIDDEN);
  const documents = await documentService.getPublicDocuments();
  return res.status(200).json(new ApiResponse(200, documents, "Public documents fetched"));
});

export const updateDocument = asyncHandler(async (req, res) => {
  const document = await documentService.updateDocument(req.params.id, req.user, req.body);
  return res.status(200).json(new ApiResponse(200, document, "Document updated"));
});

export const deleteDocument = asyncHandler(async (req, res) => {
  await documentService.deleteDocument(req.params.id, req.user);
  return res.status(200).json(new ApiResponse(200, {}, "Document deleted"));
});

export const downloadDocument = asyncHandler(async (req, res) => {
  const document = await Document.findById(req.params.id);
  if (!document) throw new ApiError(404, UX_ERRORS.FILE.NOT_FOUND);

  const isOwner = document.owner.toString() === req.user._id.toString();
  const isAdminOrMod = ["admin", "mod"].includes(req.user.role);

  if (!isOwner && !isAdminOrMod) {
    if (!document.isPublic) throw new ApiError(403, UX_ERRORS.AUTH.FORBIDDEN);
    if (["restricted", "blocked"].includes(req.user.status)) throw new ApiError(403, UX_ERRORS.AUTH.FORBIDDEN);
  }

  const urlParts = document.cloudUrl.split('/upload/');
  if (urlParts.length !== 2) throw new ApiError(500, "Invalid Cloud URL");
  return res.redirect(`${urlParts[0]}/upload/fl_attachment/${urlParts[1]}`);
});