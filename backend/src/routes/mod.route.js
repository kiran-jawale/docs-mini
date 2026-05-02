import { Router } from "express";
import {
  modGetAllUsers,
  modGetUserById,
  updateUserStatus,
  modGetAllPublicDocuments,
  toggleDocumentVisibility,
} from "../controllers/mod.controller.js";
import { deleteDocument } from "../controllers/document.controller.js"; // Import delete controller
import { isVerified } from "../middlewares/auth.middleware.js";
import { isMod, isAdminOrMod } from "../middlewares/role.middleware.js";

const router = Router();

// CRITICAL: isVerified must come BEFORE isMod to populate req.user
router.use(isVerified, isAdminOrMod);

// User Management (Status only)
router.get("/users", modGetAllUsers);
router.get("/users/:id", modGetUserById);
router.put("/users/:id/status", updateUserStatus);

// Document Management
router.get("/documents/public", modGetAllPublicDocuments);
router.put("/documents/:id/visibility", toggleDocumentVisibility);
// ADDED: Allow mods to delete public documents
router.delete("/documents/:id", deleteDocument);
router.put("/documents/:id/visibility", toggleDocumentVisibility);

export default router;