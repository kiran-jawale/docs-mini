import { Router } from 'express';
import {
  getAllUsers,
  getUserById,
  updateUserStatus,
  deleteUser,
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
} from '../controllers/admin.controller.js';
import { deleteDocument } from '../controllers/document.controller.js'; // Import delete controller
import { toggleDocumentVisibility } from '../controllers/mod.controller.js'; // Reusing logic
import { isVerified } from '../middlewares/auth.middleware.js';
import { isStaff } from '../middlewares/role.middleware.js';

const router = Router();

router.use(isVerified, isStaff);

// Customer Management
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id/status', updateUserStatus);
router.delete('/users/:id', deleteUser);

// Document Management
router.put('/documents/:id/visibility', toggleDocumentVisibility);
router.delete('/documents/:id', deleteDocument);

// Employee Management
router.post('/employees', createEmployee);
router.get('/employees', getAllEmployees);
router.get('/employees/:id', getEmployeeById);
router.put('/employees/:id', updateEmployee);

export default router;
