import express from 'express';
import { AuthController } from '../controllers/apis';
import { verifyToken } from '../utils';
import {
  LoginValidation,
  EditUserValidation,
  AddUserValidation,
  ForgotPasswordValidation,
  UpdateUserStatus,
} from '../validations';
const router = express.Router();

router.post('/login', LoginValidation, AuthController.login);
router.post(
  '/add-user',
  verifyToken,
  AddUserValidation,
  AuthController.addUser
);
router.put(
  '/update-user/:id',
  verifyToken,
  // EditUserValidation,
  AuthController.updateUser
);

router.put('/update-profile', verifyToken, AuthController.updateProfile);
router.put('/change-password', verifyToken, AuthController.changePassword);
router.delete('/delete-user/:id', verifyToken, AuthController.userDelete);
router.patch(
  '/update-status/:id',
  verifyToken,
  UpdateUserStatus,
  AuthController.updateUserStatus
);

router.get(
  '/forgot-password',
  ForgotPasswordValidation,
  AuthController.forgotPassword
);
router.get('/user-list', verifyToken, AuthController.userList);
router.get('/me', verifyToken, AuthController.me);
router.get('/user-view/:id', verifyToken, AuthController.userView);
router.get(
  '/reporting-person-list',
  verifyToken,
  AuthController.reportingPerson
);

export default router;
