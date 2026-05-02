import { Router } from "express";
import { 
  getUserAnalytics, 
  getDocAnalytics, 
  getComplaintAnalytics 
} from "../controllers/analytics.controller.js";
import { isVerified } from "../middlewares/auth.middleware.js";
import { isAdminOrHR } from "../middlewares/role.middleware.js";

const router = Router();

// CRITICAL: isVerified must come first to populate req.user
router.use(isVerified, isAdminOrHR);

router.get("/users", getUserAnalytics);
router.get("/docs", getDocAnalytics);
router.get("/complaints", getComplaintAnalytics);

export default router;