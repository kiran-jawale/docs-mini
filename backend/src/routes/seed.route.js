import { Router } from "express";
import { cleanAllSeed, safeSeed } from "../controllers/seed.controller.js";

const router = Router();

// Endpoint: POST /api/v1/seed/clean-all-seed
router.get("/clean-all-seed", cleanAllSeed);

// Endpoint: POST /api/v1/seed/safe-seed
router.get("/safe-seed", safeSeed);

export default router;