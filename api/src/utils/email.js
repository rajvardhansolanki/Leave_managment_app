const nodemailer = require('nodemailer');
import express from 'express';
import dotenv from 'dotenv';
import { Request } from '../utils';
import fs from 'fs';
import path from 'path';
let con = dotenv.config();

let transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});
const AvailableTemplates = {
  EMPLOYEE_REGISTRATION: 'Registration',
  LEAVE_REQUEST: 'LeaveRequest',
  LEAVE_STATUS: 'LeaveStatus',
  FORGOT_PASSWORD: 'ForgotPassword',
};

console.log(process.env.EMAIL_USER);
console.log(process.env.EMAIL_PASSWORD);
class Email {
  cc;
  subject;
  to;
  host;
  body;
  webURL;
  adminURL;
  constructor(req) {
    this.body = '';
    this.subject = '';
    this.to = [];
    this.cc = [];
    const host =
      req && req.headers && req.headers.referer
        ? req.headers.referer.split('/')
        : [];
    this.host = [host[0] || '', host[1] || '', host[2] || ''].join('/');
    this.webURL = '';
    this.adminURL = '';
  }

  async setTemplate(templateName, replaceObject) {
    switch (templateName) {
      case AvailableTemplates.EMPLOYEE_REGISTRATION:
        this.subject = 'Registration';
        break;
      case AvailableTemplates.LEAVE_REQUEST:
        this.subject = 'Application for Leave';
        break;
      case AvailableTemplates.LEAVE_STATUS:
        this.subject = 'Leave Application Status';
        break;
      case AvailableTemplates.FORGOT_PASSWORD:
        this.subject = 'Forgot Password';
        break;

      default:
        break;
    }

    // if (!templateName) {
    //   throw new Error('Please provide template name');
    // }
    const header = fs.readFileSync(
      path.join(__dirname, '..', 'emailTemplate', 'Header.html'),
      'utf8'
    );

    const footer = fs.readFileSync(
      path.join(__dirname, '..', 'emailTemplate', 'Footer.html'),
      'utf8'
    );
    let content = `${fs.readFileSync(
      path.join(__dirname, '..', 'emailTemplate', `${templateName}.html`),
      'utf8'
    )}`;

    // To replace variables dynamically
    for (const key in replaceObject) {
      if (replaceObject.hasOwnProperty(key)) {
        const val = replaceObject[key];
        content = content.replace(new RegExp(`{${key}}`, 'g'), val);
      }
    }
    content = `${header}${content}${footer}`;

    this.body = content;

    return content;
  }

  setSubject(subject) {
    this.subject = subject;
  }
  setBody(body) {
    this.body = body;
  }
  setCC(cc) {
    this.cc = cc;
  }
  async sendEmail(email) {
    if (!email) {
      throw new Error('Please provide email.');
    }
    const mailOption = {
      from: 'Chapter247 <test.chapter247@gmail.com>',
      to: email,
      cc: this.cc,
      subject: this.subject,
      html: this.body,
    };
    let resp = transporter.sendMail(mailOption);
    return resp;
  }
}

export { Email, AvailableTemplates };
