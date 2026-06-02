import { Router } from 'express';
import {
  createNotice,
  getActiveNotices,
  deleteNotice,
} from '../controllers/notice.controller.js';
import { isVerified } from '../middlewares/auth.middleware.js';
import { isAdminOrMod } from '../middlewares/role.middleware.js';

const router = Router();

router.get('/', getActiveNotices);
router.post('/', isAdminOrMod, createNotice);
router.delete('/:id', isAdminOrMod, deleteNotice);

export default router;
