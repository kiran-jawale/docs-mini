import { Router } from "express";
import { 
  getUserAnalytics, 
  getDocAnalytics, 
  getComplaintAnalytics 
} from "../controllers/analytics.controller.js";
import { isVerified } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/role.middleware.js";

const router = Router();

router.use(isVerified, isAdmin);

router.get("/users", getUserAnalytics);
router.get("/docs", getDocAnalytics);
router.get("/complaints", getComplaintAnalytics);

export default router;