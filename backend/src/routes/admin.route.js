import { Router } from "express";
import {
  getAllUsers,
  getUserById,
  updateUserStatus,
  deleteUser,
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
} from "../controllers/admin.controller.js";
import { isVerified } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/role.middleware.js";

const router = Router();

router.use(isVerified, isAdmin);

// Customer Management
router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.put("/users/:id/status", updateUserStatus);
router.delete("/users/:id", deleteUser);

// Employee Management (No Delete Route)
router.post("/employees", createEmployee);
router.get("/employees", getAllEmployees);
router.get("/employees/:id", getEmployeeById);
router.put("/employees/:id", updateEmployee);

export default router;