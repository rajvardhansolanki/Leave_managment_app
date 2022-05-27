import { body } from 'express-validator';
import { Message, Constant } from '../common';

const AddLeaveRequestValidation = [
  body('reason')
    .not()
    .isEmpty()
    .withMessage(Message.Required.replace(':item', 'Reason to Leave')),

  body('datesToRequest')
    .not()
    .isEmpty()
    .withMessage(Message.Required.replace(':item', 'Dates to Leave')),
];

const UpdateLeaveStatus = [
  body('status')
    .not()
    .isEmpty()
    .withMessage(Message.Required.replace(':item', 'Status')),
];

export { AddLeaveRequestValidation, UpdateLeaveStatus };
