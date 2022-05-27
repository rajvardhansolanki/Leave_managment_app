/** @format */

import { Schema, model } from 'mongoose';

const schema = new Schema({
  firstName: { type: String, default: '' },
  middleName: { type: String, default: '' },
  lastName: { type: String, default: '' },
  designation: { type: String, default: '' },

  role: {
    type: String,
    default: 'Employee',
    enum: ['Employee', 'Admin'],
  },
  department: {
    type: String,
    default: 'Engineering',
    enum: ['Engineering', 'Business Development', 'HR'],
  },
  gender: {
    type: String,
    default: '',
    enum: ['Male', 'Female', 'Other', ''],
  },
  email: { type: String, default: null },
  reportingPerson: [{ type: Schema.Types.ObjectId, ref: 'Users' }],
  profilePicture: { type: String, default: null },
  password: { type: String, default: null },
  status: {
    type: String,
    default: 'Active',
    enum: ['Active', 'Inactive'],
  },
  emailVerified: { type: Boolean, default: false },

  verifyToken: { type: String, default: null },

  isDeleted: { type: Boolean, default: false },

  createdBy: { type: Schema.Types.ObjectId, ref: 'Users' },
  createdAt: { type: Date, default: Date.now },
  modifiedBy: { type: Schema.Types.ObjectId, ref: 'Users' },
  modifiedAt: { type: Date, default: Date.now },
});

export default model('Users', schema);
