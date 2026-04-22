import { Router } from "express";
import {
  registerUser,
  login,
  logout,
  getMyProfile,
  updateProfile,
  changePassword,
} from "../controllers/auth.controller.js";
import { isVerified } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", login);

// Secured Routes
router.post("/logout", isVerified, logout);
router.get("/me", isVerified, getMyProfile);
router.post("/change-password", isVerified, changePassword);
router.put("/update-profile", isVerified, updateProfile);

export default router;