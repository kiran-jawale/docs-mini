import { Router } from "express";
import {
  uploadDocument,
  getMyDocuments,
  getPublicDocuments,
  updateDocument,
  deleteDocument,
  downloadDocument,
} from "../controllers/document.controller.js";
import { isVerified } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { uploadLimiter } from "../middlewares/rateLimiter.middleware.js";

const router = Router();

router.post("/", uploadLimiter, upload.single("documentFile"), uploadDocument);
router.get("/my", getMyDocuments);
router.get("/public", getPublicDocuments);
router.put("/:id", updateDocument);
router.delete("/:id", deleteDocument);

// --- DOWNLOAD DOCUMENT ROUTE ---
router.get("/download/:id", downloadDocument);

export default router;