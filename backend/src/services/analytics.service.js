import { User } from "../models/user.model.js";
import { Document } from "../models/document.model.js";
import { Complaint } from "../models/complaint.model.js";

class AnalyticsService {
  // A. Users Analytics
  async getFilteredUserMetrics(filters) {
    const matchStage = {};
    if (filters.status) matchStage.status = filters.status;

    return await User.aggregate([
      { $match: matchStage },
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);
  }

  // B. Docs Analytics (Requires joining User table to filter by User Status)
  async getFilteredDocMetrics(filters) {
    const matchStage = {};
    if (filters.isPublic !== undefined) {
      matchStage.isPublic = filters.isPublic === 'true';
    }
    if (filters.fileType) {
      matchStage.fileType = filters.fileType;
    }

    const pipeline = [
      { $match: matchStage },
      // Join with users to allow filtering by owner's status
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "ownerDetails"
        }
      },
      { $unwind: "$ownerDetails" }
    ];

    // If filtering by user status, add another match after the join
    if (filters.userStatus) {
      pipeline.push({ $match: { "ownerDetails.status": filters.userStatus } });
    }

    // Grouping the final results
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

  // C. Complaint Analytics
  async getFilteredComplaintMetrics(filters) {
    const pipeline = [
      {
        $lookup: {
          from: "users",
          localField: "raisedBy",
          foreignField: "_id",
          as: "raiserDetails"
        }
      },
      { $unwind: "$raiserDetails" }
    ];

    const matchStage = {};
    if (filters.status) matchStage.status = filters.status;
    if (filters.userStatus) matchStage["raiserDetails.status"] = filters.userStatus;

    if (Object.keys(matchStage).length > 0) {
      pipeline.push({ $match: matchStage });
    }

    pipeline.push({ $group: { _id: "$status", count: { $sum: 1 } } });

    return await Complaint.aggregate(pipeline);
  }
}

export default new AnalyticsService();