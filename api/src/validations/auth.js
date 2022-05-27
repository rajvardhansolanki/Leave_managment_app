import { body } from 'express-validator';
import { Message, Constant } from '../common';

const LoginValidation = [
  body('email')
    .not()
    .isEmpty()
    .withMessage(Message.Required.replace(':item', 'Email'))
    .trim()
    .isEmail()
    .withMessage(Message.InvalidEmail),
  body('password')
    .not()
    .isEmpty()
    .withMessage(Message.Required.replace(':item', 'Password'))
    .trim()
    .isLength({ min: Constant.FieldsMinLengths.password })
    .withMessage(
      Message.MinLengthError.replace(':item', 'Password').replace(
        ':length',
        Constant.FieldsMinLengths.password
      )
    ),
];
const AddUserValidation = [
  body('email')
    .not()
    .isEmpty()
    .withMessage(Message.Required.replace(':item', 'Email'))
    .trim()
    .isEmail()
    .withMessage(Message.InvalidEmail),
  body('department')
    .not()
    .isEmpty()
    .withMessage(Message.Required.replace(':item', 'Department')),
  body('designation')
    .not()
    .isEmpty()
    .withMessage(Message.Required.replace(':item', 'Designation')),
  body('firstName')
    .not()
    .isEmpty()
    .withMessage(Message.Required.replace(':item', 'FirstName'))
    .isLength({ min: Constant.FieldsMinLengths.firstName })
    .withMessage(
      Message.MinLengthError.replace(':item', 'FirstName').replace(
        ':length',
        Constant.FieldsMinLengths.firstName
      )
    ),
  body('lastName')
    .not()
    .isEmpty()
    .withMessage(Message.Required.replace(':item', 'LastName'))
    .isLength({ min: Constant.FieldsMinLengths.lastName })
    .withMessage(
      Message.MinLengthError.replace(':item', 'LastName').replace(
        ':length',
        Constant.FieldsMinLengths.lastName
      )
    ),
];
const EditUserValidation = [
  body('firstName')
    .not()
    .isEmpty()
    .withMessage(Message.Required.replace(':item', 'FirstName'))
    .isLength({ min: Constant.FieldsMinLengths.firstName })
    .withMessage(
      Message.MinLengthError.replace(':item', 'FirstName').replace(
        ':length',
        Constant.FieldsMinLengths.firstName
      )
    ),
  body('lastName')
    .not()
    .isEmpty()
    .withMessage(Message.Required.replace(':item', 'LastName'))
    .isLength({ min: Constant.FieldsMinLengths.lastName })
    .withMessage(
      Message.MinLengthError.replace(':item', 'LastName').replace(
        ':length',
        Constant.FieldsMinLengths.lastName
      )
    ),
];
const ForgotPasswordValidation = [
  body('email')
    .not()
    .isEmpty()
    .withMessage(Message.Required.replace(':item', 'Email'))
    .trim()
    .isEmail()
    .withMessage(Message.InvalidEmail),
];
const UpdateUserStatus = [
  body('status')
    .not()
    .isEmpty()
    .withMessage(Message.Required.replace(':item', 'Status')),
];

export {
  LoginValidation,
  EditUserValidation,
  AddUserValidation,
  ForgotPasswordValidation,
  UpdateUserStatus,
};
