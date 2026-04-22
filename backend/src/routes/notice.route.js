import { Router } from "express";
import { createNotice, getActiveNotices, deleteNotice } from "../controllers/notice.controller.js";
import { isVerified } from "../middlewares/auth.middleware.js";
import { isAdminOrMod } from "../middlewares/role.middleware.js";

const router = Router();

router.use(isVerified);
router.get("/", getActiveNotices); // All logged-in users can read notices
router.post("/", isAdminOrMod, createNotice); // Only Admins/Mods can create
router.delete("/:id", isAdminOrMod, deleteNotice);

export default router;