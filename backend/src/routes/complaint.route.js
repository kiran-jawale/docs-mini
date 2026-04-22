import { Router } from "express";
import { 
  createComplaint, 
  getMyComplaints, 
  getAllComplaints, 
  updateComplaintStatus, 
  deleteComplaint 
} from "../controllers/complaint.controller.js";
import { isVerified } from "../middlewares/auth.middleware.js";
import { isAdminOrMod } from "../middlewares/role.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.use(isVerified);

// User Routes
router.post("/", upload.array("images", 3), createComplaint);
router.get("/my", getMyComplaints);

// Staff Routes (Admin or Mod)
router.get("/all", isAdminOrMod, getAllComplaints);
router.put("/:id/status", isAdminOrMod, updateComplaintStatus);
router.delete("/:id", isAdminOrMod, deleteComplaint);

export default router;