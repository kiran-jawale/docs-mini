// src/services/analytics.service.js
import { User } from "../models/user.model.js";
import { Document } from "../models/document.model.js";
import { Complaint } from "../models/complaint.model.js";

class AnalyticsService {
  // A. Users: Returns all status groups for Pie/Bar charts
  async getFilteredUserMetrics() {
    return await User.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);
  }

  // B. Docs: Existing high-quality logic preserved
  async getFilteredDocMetrics(filters) {
    const matchStage = {};
    if (filters.isPublic !== undefined && filters.isPublic !== "") {
      matchStage.isPublic = filters.isPublic === 'true';
    }

    const pipeline = [{ $match: matchStage }];
    
    pipeline.push({
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "ownerDetails"
      }
    }, { $unwind: "$ownerDetails" });

    if (filters.userStatus) {
      pipeline.push({ $match: { "ownerDetails.status": filters.userStatus } });
    }

    pipeline.push({
      $facet: {
        storageByType: [
          { $group: { _id: "$fileType", totalSize: { $sum: "$fileSize" }, count: { $sum: 1 } } }
        ],
        visibilityStats: [
          { $group: { _id: "$isPublic", count: { $sum: 1 } } }
        ],
        totalStats: [
          { $group: { _id: null, totalBytes: { $sum: "$fileSize" }, totalDocs: { $sum: 1 } } }
        ]
      }
    });

    return await Document.aggregate(pipeline);
  }

  // C. Complaint: Enhanced to return structured facets for charts
  async getFilteredComplaintMetrics(filters) {
    const matchStage = {};
    if (filters.userStatus) {
      const users = await User.find({ status: filters.userStatus }).select('_id');
      matchStage.raisedBy = { $in: users.map(u => u._id) };
    }

    return await Complaint.aggregate([
      { $match: matchStage },
      {
        $facet: {
          statusCounts: [{ $group: { _id: "$status", count: { $sum: 1 } } }],
          priorityStats: [{ $group: { _id: "$priority", count: { $sum: 1 } } }] // Added for dual charts
        }
      }
    ]);
  }
}

export default new AnalyticsService();