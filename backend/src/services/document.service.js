import { Document } from "../models/document.model.js";
import { ApiError } from "../utils/ApiError.js";
import cloudinaryService from "./cloudinary.service.js";

class DocumentService {
  async uploadDocument(data, file, user) {
    const isImage = file.mimetype.startsWith('image/');
    const resourceType = isImage ? "image" : "raw";

    // Upload to Cloudinary
    const cloudRes = await cloudinaryService.upload(file.path, "docsmini/documents");
    if (!cloudRes) throw new ApiError(500, "Cloud upload failed");

    // Enforce constraints based on user status
    let isPublic = data.isPublic === "true" || data.isPublic === true;
    if (["restricted", "blocked"].includes(user.status)) {
      isPublic = false;
    }

    return await Document.create({
      title: data.title,
      description: data.description,
      cloudUrl: cloudRes.secure_url,
      cloudPublicId: cloudRes.public_id,
      fileType: file.mimetype,
      fileSize: file.size,
      isPublic,
      owner: user._id,
    });
  }

  async getDocumentsByOwner(userId) {
    return await Document.find({ owner: userId }).sort({ createdAt: -1 });
  }

  async getPublicDocuments() {
    return await Document.find({ isPublic: true })
      .populate("owner", "fullname email")
      .sort({ createdAt: -1 });
  }

  async updateDocument(id, user, updateData) {
    const document = await Document.findById(id);
    if (!document) throw new ApiError(404, "Document not found");

    if (document.owner.toString() !== user._id.toString()) {
      throw new ApiError(403, "You can only edit your own documents");
    }

    document.title = updateData.title || document.title;
    document.description = updateData.description || document.description;
    await document.save();

    return document;
  }

  async deleteDocument(id, user) {
    const document = await Document.findById(id);
    if (!document) throw new ApiError(404, "Document not found");

    // Allow owner OR an admin to delete
    const isOwner = document.owner.toString() === user._id.toString();
    const isAdmin = user.role === 'admin';
    
    if (!isOwner && !isAdmin) {
      throw new ApiError(403, "You do not have permission to delete this document");
    }

    const resourceType = document.fileType.startsWith('image/') ? 'image' : 'raw';
    await cloudinaryService.delete(document.cloudPublicId, resourceType);
    
    await Document.findByIdAndDelete(id);
  }
}

export default new DocumentService();