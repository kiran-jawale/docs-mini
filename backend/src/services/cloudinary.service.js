import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

class CloudinaryService {
  async upload(localFilePath, folderName = "docsmini") {
    try {
      if (!localFilePath) return null;
      
      const response = await cloudinary.uploader.upload(localFilePath, {
        resource_type: "auto",
        folder: folderName,
      });
      
      fs.unlinkSync(localFilePath);
      return response;
    } catch (error) {
      console.error("Cloudinary Upload Error:", error);
      if (fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath);
      }
      return null;
    }
  }

  async delete(publicId, resourceType = "image") {
    try {
      if (!publicId) return null;
      const response = await cloudinary.uploader.destroy(publicId, {
        resource_type: resourceType,
      });
      return response;
    } catch (error) {
      console.error("Cloudinary Delete Error:", error);
      return null;
    }
  }
}

export default new CloudinaryService();