import { Complaint } from "../models/complaint.model.js";
import { ApiError } from "../utils/ApiError.js";
import { UX_ERRORS } from "../constants/uxErrors.js";
import cloudinaryService from "./cloudinary.service.js";

class ComplaintService {
  async createComplaint(data, files, userId) {
    let cloudImages = [];

    if (files && files.length > 0) {
      for (const file of files) {
        const cloudRes = await cloudinaryService.upload(file.path, "docsmini/complaints");
        if (cloudRes) {
          cloudImages.push({ url: cloudRes.secure_url, publicId: cloudRes.public_id });
        }
      }
    }

    return await Complaint.create({
      subject: data.subject,
      description: data.description,
      images: cloudImages,
      raisedBy: userId,
    });
  }

  async getUserComplaints(userId) {
    return await Complaint.find({ raisedBy: userId }).sort({ createdAt: -1 });
  }

  async getAllComplaints(statusFilter) {
    const query = statusFilter ? { status: statusFilter } : {};
    return await Complaint.find(query)
      .populate("raisedBy", "fullname email")
      .populate("assignedTo", "fullname dept")
      .sort({ createdAt: -1 });
  }

  async updateComplaintStatus(id, status, employeeId) {
    const complaint = await Complaint.findByIdAndUpdate(
      id,
      { status, assignedTo: employeeId },
      { new: true }
    );

    if (!complaint) throw new ApiError(404, UX_ERRORS.COMPLAINT.NOT_FOUND);
    return complaint;
  }

  async deleteComplaint(id) {
    const complaint = await Complaint.findById(id);
    if (!complaint) throw new ApiError(404, UX_ERRORS.COMPLAINT.NOT_FOUND);

    for (const img of complaint.images) {
      await cloudinaryService.delete(img.publicId, "image");
    }

    await Complaint.findByIdAndDelete(id);
  }
}

export default new ComplaintService();