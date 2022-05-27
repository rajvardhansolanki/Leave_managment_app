/** @format */

import { Schema, model } from 'mongoose';

const schema = new Schema({
  datesToRequest: [{ type: Date }],
  reason: { type: String, default: '' },
  status: {
    type: String,
    default: 'Pending',
    enum: ['Approved', 'Disapproved', 'Pending'],
  },
  leaveType: {
    type: String,
    default: 'Fullday',
    enum: ['Fullday', 'Halfday'],
  },

  isDeleted: { type: Boolean, default: false },

  userId: { type: Schema.Types.ObjectId, ref: 'Users' },
  createdBy: { type: Schema.Types.ObjectId, ref: 'Users' },
  createdAt: { type: Date, default: Date.now },
  modifiedBy: { type: Schema.Types.ObjectId, ref: 'Users' },
  modifiedAt: { type: Date, default: Date.now },
});

export default model('LeaveRequest', schema);
