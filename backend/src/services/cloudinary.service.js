import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import { SYSTEM_ERRORS } from '../constants/systemErros.js';
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

class CloudinaryService {
  async upload(localFilePath, folderName = 'docsmini') {
    try {
      if (!localFilePath) return null;
 
      const response = await cloudinary.uploader.upload(localFilePath, {
        resource_type: 'auto',
        folder: folderName,
      }); 
      if (fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath);
      }

      return response;
    } catch (error) { 
      console.error(`🔴 CLOUDINARY UPLOAD FAILED:`, error.message || error);
 
      console.log(`[SYSTEM ALERT] ${SYSTEM_ERRORS.CLOUD_UPLOAD_ERR}`);
 
      if (fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath);
      }
      return null;
    }
  }

  async delete(publicId, resourceType = 'image') {
    try {
      if (!publicId) return null;
      const response = await cloudinary.uploader.destroy(publicId, {
        resource_type: resourceType,
      });
      return response;
    } catch (error) {
      console.error(`🔴 CLOUDINARY DELETE FAILED:`, error.message || error);
      console.log(`[SYSTEM ALERT] Cloudinary Delete Failed for ${publicId}`);
      return null;
    }
  }
}

export default new CloudinaryService();
