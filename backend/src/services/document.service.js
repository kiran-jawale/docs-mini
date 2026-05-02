import { Document } from '../models/document.model.js';
import { ApiError } from '../utils/ApiError.js';
import { UX_ERRORS } from '../constants/uxErrors.js';
import { SYSTEM_ERRORS } from '../constants/systemErros.js';
import cloudinaryService from './cloudinary.service.js';

class DocumentService {
  async uploadDocument(data, file, user) {
    const cloudRes = await cloudinaryService.upload(file.path, 'docsmini/documents');
    if (!cloudRes) {
      console.error(`[SYSTEM] ${SYSTEM_ERRORS.CLOUD_UPLOAD_ERR}`);
      throw new ApiError(500, UX_ERRORS.CRUD.UPLOAD_FAIL);
    }

    let isPublic = data.isPublic === 'true' || data.isPublic === true;
    if (['restricted', 'blocked'].includes(user.status)) isPublic = false;

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
      .populate('owner', 'fullname email')
      .sort({ createdAt: -1 });
  }

  async getDocumentFeed(userId) {
    return await Document.find({
      $or: [{ owner: userId }, { isPublic: true }],
    })
      .populate('owner', 'fullname email')
      .sort({ createdAt: -1 });
  }

  // UPDATED: Allow visibility change in general update (Owner only)
  async updateDocument(id, user, updateData) {
    const document = await Document.findById(id);
    if (!document) throw new ApiError(404, UX_ERRORS.FILE.NOT_FOUND);

    if (document.owner.toString() !== user._id.toString()) {
      throw new ApiError(403, UX_ERRORS.AUTH.FORBIDDEN);
    }

    document.title = updateData.title || document.title;
    document.description = updateData.description || document.description;
    
    // Allow owner to toggle visibility via Edit Form
    if (updateData.isPublic !== undefined) {
      document.isPublic = updateData.isPublic;
    }

    await document.save();
    return document;
  }

  // NEW: Dedicated visibility toggle for Owner OR Staff (Admin/Mod)
  async toggleVisibility(id, user) {
    const document = await Document.findById(id);
    if (!document) throw new ApiError(404, UX_ERRORS.FILE.NOT_FOUND);

    const isOwner = document.owner.toString() === user._id.toString();
    const isStaff = ['admin', 'mod'].includes(user.role);

    if (!isOwner && !isStaff) {
      throw new ApiError(403, UX_ERRORS.AUTH.FORBIDDEN);
    }

    document.isPublic = !document.isPublic;
    await document.save();
    return document;
  }

  async deleteDocument(id, user) {
    const document = await Document.findById(id);
    if (!document) throw new ApiError(404, UX_ERRORS.FILE.NOT_FOUND);

    const isOwner = document.owner.toString() === user._id.toString();
    const isStaff = ['admin', 'mod'].includes(user.role);

    if (!isOwner && !isStaff) {
      throw new ApiError(403, UX_ERRORS.AUTH.FORBIDDEN);
    }

    const resourceType = document.fileType.startsWith('image/') ? 'image' : 'raw';
    await cloudinaryService.delete(document.cloudPublicId, resourceType);
    await Document.findByIdAndDelete(id);
  }
}

export default new DocumentService();