import dotenv from "dotenv";
dotenv.config();

const CONFIG = {
  PORT: process.env.PORT || 4500,
  CORS_ORIGIN: process.env.CORS_ORIGIN || "*",
  MONGODB_URI: process.env.MONGODB_URI,
  DB_NAME: process.env.DB_NAME,
  
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY,
  
  ADMIN_SECRET_CODE: process.env.ADMIN_SECRET_CODE,
  MOD_SECRET_CODE: process.env.MOD_SECRET_CODE,
  HR_SECRET_CODE: process.env.HR_SECRET_CODE,
  
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  
  NODE_ENV: process.env.NODE_ENV || "development",
  SERVE_STATIC: process.env.SERVE_STATIC === "true",
  API_VERSION: process.env.API_VERSION || "/api/v3"
};

export default CONFIG;