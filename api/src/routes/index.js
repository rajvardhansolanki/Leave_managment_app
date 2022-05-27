import express from 'express';

import AuthRouter from './auth';
import LeaveRequestRouter from './leaveRequest';
import SettingRouter from './setting';
import DashboardRouter from './dashboard';

const router = express.Router();

router.use('/auth', AuthRouter);
router.use('/leave-request', LeaveRequestRouter);
router.use('/setting', SettingRouter);
router.use('/dashboard', DashboardRouter);

export default router;
