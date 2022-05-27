import { body } from 'express-validator';
import { Message, Constant } from '../common';
const UpdateSettingValidation = [
  body('email')
    .not()
    .isEmpty()
    .withMessage(Message.Required.replace(':item', 'Email')),
  body('websiteUrl')
    .not()
    .isEmpty()
    .withMessage(Message.Required.replace(':item', 'Website Url')),
  body('youtubeUrl')
    .not()
    .isEmpty()
    .withMessage(Message.Required.replace(':item', 'Youtube Url')),
  body('linkedinUrl')
    .not()
    .isEmpty()
    .withMessage(Message.Required.replace(':item', 'Linkedin Url')),
  body('twitterUrl')
    .not()
    .isEmpty()
    .withMessage(Message.Required.replace(':item', 'Twitter Url')),
  body('orgName')
    .not()
    .isEmpty()
    .withMessage(Message.Required.replace(':item', 'Name')),
];
export { UpdateSettingValidation };
