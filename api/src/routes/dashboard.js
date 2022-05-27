import express from 'express';
import { DashboardController } from '../controllers/apis';
import { verifyToken } from '../utils';

const router = express.Router();

router.get(
  '/user-leave-count',
  verifyToken,
  DashboardController.userAndLeaveCount
);

export default router;
