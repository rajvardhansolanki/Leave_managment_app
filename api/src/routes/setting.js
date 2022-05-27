import express from 'express';
import { SettingController } from '../controllers/apis';
import { verifyToken } from '../utils';
import { UpdateSettingValidation } from '../validations';

const router = express.Router();

router.get('/', verifyToken, SettingController.settingView);
router.put(
  '/:id',
  verifyToken,
  UpdateSettingValidation,
  SettingController.updateSetting
);

export default router;
