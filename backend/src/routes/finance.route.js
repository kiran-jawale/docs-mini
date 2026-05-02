import { Router } from "express";
import { 
  getAllTransactions, 
  getPayrollTransactions, 
  createTransaction 
} from "../controllers/finance.controller.js";
import { isVerified } from "../middlewares/auth.middleware.js";
import { isAdminOrHR } from "../middlewares/role.middleware.js";

const router = Router();

// Ensure both Admin and HR can access financial ledger logic
router.use(isVerified, isAdminOrHR);

router.get("/", getAllTransactions); 
router.get("/payroll", getPayrollTransactions);
router.post("/", createTransaction);

export default router;