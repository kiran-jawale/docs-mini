import { Router } from "express";
import {
  modGetAllUsers,
  modGetUserById,
  updateUserStatus,
  modGetAllPublicDocuments,
  toggleDocumentVisibility,
} from "../controllers/mod.controller.js";
import { isVerified } from "../middlewares/auth.middleware.js";
import { isMod } from "../middlewares/role.middleware.js";

const router = Router();

router.use(isVerified, isMod);

// User Management (Status only)
router.get("/users", modGetAllUsers);
router.get("/users/:id", modGetUserById);
router.put("/users/:id/status", updateUserStatus);

// Document Management (Toggle Visibility only)
router.get("/documents/public", modGetAllPublicDocuments);
router.put("/documents/:id/visibility", toggleDocumentVisibility);

export default router;