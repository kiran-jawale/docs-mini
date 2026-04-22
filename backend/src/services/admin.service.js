import { Employee } from "../models/employee.model.js";
import { User } from "../models/user.model.js";
import { Document } from "../models/document.model.js";
import { Complaint } from "../models/complaint.model.js";
import cloudinaryService from "./cloudinary.service.js";
import { ApiError } from "../utils/ApiError.js";

class AdminService {
  // --- Employee DB Logic ---
  async createEmployee(data) {
    const existing = await Employee.findOne({ $or: [{ email: data.email }, { empCode: data.empCode }] });
    if (existing) throw new ApiError(409, "Employee with this email or code already exists");

    const emp = await Employee.create(data);
    return await Employee.findById(emp._id).select("-password");
  }

  async getAllEmployees(excludeId) {
    return await Employee.find({ _id: { $ne: excludeId } }).select("-password");
  }

  async getEmployeeById(id) {
    const emp = await Employee.findById(id).select("-password");
    if (!emp) throw new ApiError(404, "Employee not found");
    return emp;
  }

  async updateEmployee(id, data) {
    const emp = await Employee.findByIdAndUpdate(id, { $set: data }, { new: true }).select("-password");
    if (!emp) throw new ApiError(404, "Employee not found");
    return emp;
  }

  async deleteEmployee(id) {
    const emp = await Employee.findByIdAndDelete(id);
    if (!emp) throw new ApiError(404, "Employee not found");
  }

  // --- User DB Logic ---
  async getAllUsers() {
    return await User.find().select("-password");
  }

  async getUserById(id) {
    const user = await User.findById(id).select("-password");
    if (!user) throw new ApiError(404, "User not found");
    return user;
  }

  async updateUserStatus(id, status) {
    const user = await User.findByIdAndUpdate(id, { status }, { new: true }).select("-password");
    if (!user) throw new ApiError(404, "User not found");
    return user;
  }

  async deleteUserAndAssets(userId) {
    const user = await User.findById(userId);
    if (!user) throw new ApiError(404, "User not found");

    // 1. Delete user's documents from Cloudinary
    const userDocs = await Document.find({ owner: userId });
    for (const doc of userDocs) {
      const resourceType = doc.fileType.startsWith('image/') ? 'image' : 'raw';
      await cloudinaryService.delete(doc.cloudPublicId, resourceType);
    }
    
    // 2. Delete user's documents from DB
    await Document.deleteMany({ owner: userId });

    // 3. Delete user's complaints images from Cloudinary
    const userComplaints = await Complaint.find({ raisedBy: userId });
    for (const complaint of userComplaints) {
        for(const img of complaint.images) {
             await cloudinaryService.delete(img.publicId, 'image');
        }
    }

    // 4. Delete user's complaints from DB
    await Complaint.deleteMany({ raisedBy: userId });

    // 5. Delete User
    await User.findByIdAndDelete(userId);
  }
}

export default new AdminService();