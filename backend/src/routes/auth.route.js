import { Router } from "express";
import { 
  registerUser, login, logout, getMyProfile, updateProfile, 
  updateEmail, updateUserID, changePassword 
} from "../controllers/auth.controller.js";
import { isVerified } from "../middlewares/auth.middleware.js";

const router = Router();

// Public Routes
router.post("/register", registerUser);
router.post("/login", login);

// Protected Routes
router.post("/logout", isVerified, logout);
router.get("/me", isVerified, getMyProfile);
router.patch("/update-profile", isVerified, updateProfile);
router.patch("/update-email", isVerified, updateEmail);
router.patch("/update-userid", isVerified, updateUserID);
router.post("/change-password", isVerified, changePassword);

export default router;