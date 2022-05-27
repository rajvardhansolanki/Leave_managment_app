/** @format */

import { Schema, model } from 'mongoose';

const schema = new Schema({
  websiteUrl: { type: String, default: '' },
  youtubeUrl: { type: String, default: '' },
  linkedinUrl: { type: String, default: '' },
  twitterUrl: { type: String, default: '' },
  orgName: { type: String, default: '' },

  email: [{ type: String, default: null }],

  isDeleted: { type: Boolean, default: false },

  createdBy: { type: Schema.Types.ObjectId, ref: 'Users' },
  createdAt: { type: Date, default: Date.now },
  modifiedBy: { type: Schema.Types.ObjectId, ref: 'Users' },
  modifiedAt: { type: Date, default: Date.now },
});

export default model('Setting', schema);
