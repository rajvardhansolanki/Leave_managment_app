import jwt from 'jsonwebtoken';
import { UserModel } from '../../models';

import { Message } from '../../common';
import {
  generatePassword,
  generateSalt,
  encryptPassword,
  comparePassword,
  Email,
  AvailableTemplates,
  ValidationFormatter,
  CheckValidation,
} from '../../utils';
import { Types } from 'mongoose';

/**
 -----------------------
       USER LOGIN
 -----------------------
 */
/**
 * @api {post} auth/login  User Login
 * @apiName User Login
 * @apiGroup Auth
 * @apiPermission none
 * @apiDescription Login API for User
 * @apiParam {String} email Email of the User.
 * @apiParam {String} password Password of the User.
 * @apiParamExample {Object} Request-Example:
{
    "email": "jon@mail.com",
    "password": "123456"
}
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
* {
 *   message: "Logged in Successfully"
 *   responseCode: 200,
 *   data: userCheck,
 * token: token,
 * }
 * @apiErrorExample {json} List error
 *  HTTP/1.1 422 Unprocessable Entity
 * {
 *  message: "Invalid request",
 *   success: false
 *}
 * HTTP/1.1 404 NotFound
 * {
 *    message:'User not found'
 *  responseCode: 404,
 *  success: false
 * }
 * * HTTP/1.1 400 accountDeactivated
 * {
 *    message:"Your account is Deactivated Please contact to Admin",
 *  success: false
 * }
 * * HTTP/1.1 400 PasswordNotMatch
 * {
 *    message:"Password did not match",
 *  success: false
 * }
 *    HTTP/1.1 500 Internal Server Error
 */
const login = async (req, res) => {
  const errors = CheckValidation(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: ValidationFormatter(errors.mapped()),
      success: false,
    });
  }
  try {
    const { email, password } = req.body;

    let userCheck = await UserModel.findOne({
      email: email.trim().toLowerCase(),
      isDeleted: false,
    });
    if (!userCheck) {
      return res.status(404).json({
        success: false,
        message: Message.NotFound.replace(':item', 'User'),
      });
    }
    if (userCheck.status === 'Inactive') {
      return res.status(400).json({
        success: false,
        message: Message.AccountDeactivated,
      });
    }
    if (!comparePassword(password, userCheck.password)) {
      return res.status(400).json({
        success: false,
        message: Message.PasswordNotMatched,
      });
    }
    let token;
    if (userCheck) {
      token = jwt.sign(
        {
          userId: userCheck._id,
          email,
          role: userCheck.role,
          reportingPerson: userCheck.reportingPerson,
        },
        process.env.TOKEN_KEY,
        {
          expiresIn: '5d',
        }
      );
    }

    return res.status(200).json({
      success: true,
      message: Message.LoginSuccess,
      data: userCheck,
      token: token,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: Message.UnexpectedError,
      error: error.message,
    });
  }
};

/**
 -----------------------
      ADD USER
 -----------------------
 */
/**
 * @api {post} auth/add-user  Add User
 * @apiName addUser
 * @apiGroup Auth
 * @apiPermission admin
 * @apiDescription Add API for User
 * @apiParam {String} firstName First name of User.
 * @apiParam {String} lastName Last name of User.
 * @apiParam {String} middleName Middle name of User.
 * @apiParam {String} email email of User.
 * @apiParam {String} role role of User.
 * @apiParam {String} gender gender of User.
 * @apiParam {String} designation designation of User.
 * @apiParam {String} department department of User.
 * @apiParam {Array} reportingPerson reportingPerson of User.
 * @apiParam {String} reason reason  for leave.
 * @apiParamExample {Object} Request-Example:
{
    
      "firstName":"mohan",
      "lastName":"thakur",
      "email":"mohanroy1@mailinator.com",
      "middleName":"singh",
     "department":"Engineering",
      "role":"Employee",
      "reportingPerson":["616804ff21f032a210461e7d"],
      "gender":"Male"
}
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
* {
 *   responseCode: 200,
      data: result,
      message: 'User Added successfully.',
      success: true,
 * }
 * @apiErrorExample {json} List error

 *  HTTP/1.1 400 AlreadyExist
 * {
       message: "User Already Exist
 * }
 *    HTTP/1.1 500 Internal Server Error
 */

const addUser = async (req, res) => {
  const errors = CheckValidation(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: ValidationFormatter(errors.mapped()),
      success: false,
    });
  }
  try {
    const { body, currentUser } = req;
    const {
      firstName,
      lastName,
      middleName,
      email,
      role,
      department,
      reportingPerson,
      gender,
      designation,
    } = body;
    const users = await UserModel.findOne({
      email: email.trim().toLowerCase(),
      role,
      isDeleted: false,
    });
    if (users) {
      return res.status(400).json({
        code: 400,
        message: Message.AlreadyExist.replace(':item', 'User'),
        success: false,
      });
    }
    const salt = generateSalt();
    let password = generatePassword();
    let encryptedPassword = encryptPassword(password, salt);
    // let y = comparePassword(pass, x);
    const data = {
      firstName,
      lastName,
      middleName,
      email: email.trim().toLowerCase(),
      role,
      reportingPerson,
      gender,
      designation,
      department,
      password: encryptedPassword,
      createdBy: currentUser.userId,
    };
    const userData = new UserModel(data);
    const result = await userData.save();
    try {
      const emailSend = new Email();
      await emailSend.setTemplate(AvailableTemplates.EMPLOYEE_REGISTRATION, {
        fullName: `${firstName} ${lastName} `,
        email,
        password,
      });
      await emailSend.sendEmail(email);
    } catch (error) {
      return res.status(201).json({
        message: error.message,
        isAdded: true,
      });
    }
    return res.status(200).json({
      success: true,
      message: Message.AddSuccess.replace(':item', 'User'),
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: Message.UnexpectedError,
      error: error.message,
    });
  }
};
/**
 ---------------------------
       FORGOT PASSWORD
 ---------------------------

 * @api {get} auth/forgot-password   Forgot password
 * @apiName forgotPassword
 * @apiGroup Auth
 * @apiDescription  To recover forgot password
 * @apiPermission none
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *   message: 'Email sent. Please check your inbox.',
 *   data: updateToken,
 *   success: true
 * }
 * @apiErrorExample {json}  error
 *    HTTP/1.1 400 EmailNotFound
 * {
 *    message:'Email not found',
      success: false,
 * }
 *    HTTP/1.1 500 Unknown Error
 * {
 *    message: "Unexpected error occurred"
 *    success: false,
 *    
 * }
 *  HTTP/1.1 422 Unprocessable Entity
 * {
 *  message: "Invalid request",
 *   success: false
 * }
 */
const forgotPassword = async (req, res) => {
  const errors = CheckValidation(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: ValidationFormatter(errors.mapped()),
      success: false,
    });
  }
  try {
    const { body } = req;
    const { email } = body;
    const users = await UserModel.findOne({
      email: email.trim().toLowerCase(),
      isDeleted: false,
    });
    if (!users) {
      return res.status(400).json({
        message: Message.NotFound.replace(':item', 'Email'),
        success: false,
      });
    }
    const salt = generateSalt();
    let password = generatePassword();
    let encryptedPassword = encryptPassword(password, salt);
    // let y = comparePassword(pass, x);
    await UserModel.updateOne(
      { _id: users._id },
      {
        $set: {
          password: encryptedPassword,
        },
      }
    );

    try {
      const emailSend = new Email();
      await emailSend.setTemplate(AvailableTemplates.FORGOT_PASSWORD, {
        fullName: `${users.firstName} ${users.lastName} `,
        email,
        password,
      });
      await emailSend.sendEmail(users.email);
    } catch (error) {
      return res.status(201).json({
        message: error.message,
        isAdded: true,
      });
    }
    return res.status(200).json({
      success: true,
      message: Message.EmailSent,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: Message.UnexpectedError,
      error: error.message,
    });
  }
};
/**
 ---------------------------
         USER LIST
 ---------------------------

 * @api {get} auth/user-list       Get user list  
 * @apiName userList
 * @apiGroup Auth
 * @apiDescription To get User List 
 * @apiPermission Admin
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *   message: 'User list fetched Successfully',
 *   data: data,
 *   totalRecords,
 *   success: true
 * }
 * @apiErrorExample {json}  error
 *    HTTP/1.1 500 Unknown Error
 * {
 *    message: "Unexpected error occurred"
 *    success: false,
 *    
 * }
 */

const userList = async (req, res) => {
  try {
    const { query } = req;

    const limit = query.limit ? parseInt(query.limit, 10) : 10;
    const page = query.page ? parseInt(query.page, 10) : 1;
    const skip = (page - 1) * limit;
    const { search, gender, status, fromDate, toDate, role, department } =
      query;

    let dateCondition = {};
    if (fromDate != null && toDate != null) {
      dateCondition = {
        $gte: new Date(
          new Date(fromDate).setUTCHours(
            parseInt('00', 10, '00', 10, '00', 10, '000', 10)
          )
        ),
        $lte: new Date(new Date(toDate).setUTCHours(23, 59, 59, 999)),
      };
    }

    let condition = { isDeleted: false };
    if (search) {
      condition = {
        ...condition,
        $or: [
          {
            firstName: {
              $regex: new RegExp(search.trim(), 'i'),
            },
          },
          {
            fullName: {
              $regex: new RegExp(search.trim(), 'i'),
            },
          },
          {
            lastName: {
              $regex: new RegExp(search.trim(), 'i'),
            },
          },
          {
            email: {
              $regex: new RegExp(search.trim(), 'i'),
            },
          },
          {
            department: {
              $regex: new RegExp(search.trim(), 'i'),
            },
          },
        ],
      };
    }

    if (gender) {
      condition = {
        ...condition,
        gender,
      };
    }
    if (role) {
      condition = {
        ...condition,
        role,
      };
    }
    if (department) {
      condition = {
        ...condition,
        department,
      };
    }
    if (status) {
      condition = {
        ...condition,
        status,
      };
    }

    if (fromDate && toDate) {
      condition = {
        ...condition,
        createdAt: dateCondition,
      };
    }

    const data = await UserModel.aggregate([
      {
        $addFields: {
          fullName: {
            $concat: [
              '$firstName',
              ' ',
              { $ifNull: ['$middleName', ''] },
              ' ',
              '$lastName',
            ],
          },
        },
      },

      {
        $match: condition,
      },

      { $sort: { _id: -1 } },
      { $skip: skip },
      { $limit: limit },
    ]);
    const totalRecords = await UserModel.aggregate([
      {
        $addFields: {
          fullName: {
            $concat: [
              '$firstName',
              ' ',
              { $ifNull: ['$middleName', ''] },
              ' ',
              '$lastName',
            ],
          },
        },
      },

      {
        $match: condition,
      },

      {
        $count: 'count',
      },
    ]);

    return res.status(200).json({
      success: true,
      message: Message.ListFetchSuccess.replace(':item', 'User'),
      data,
      totalRecords:
        totalRecords && totalRecords.length ? totalRecords[0].count : 0,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: Message.UnexpectedError,

      error: error.message,
    });
  }
};
/**
 ---------------------------
         USER VIEW
 ---------------------------

 * @api {get} auth/user-view/:id       Get a user Details  
 * @apiName userView
 * @apiGroup Auth
 * @apiDescription Api To get User Details 
 * @apiPermission Admin
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *   message: 'User Details fetched Successfully',
 *   data: data,
 *   success: true
 * }
 * @apiErrorExample {json}  error
 *    HTTP/1.1 500 Unknown Error
 * {
 *    message: "Unexpected error occurred"
 *    success: false,
 *    
 * }
 */
const userView = async (req, res, next) => {
  try {
    const { params } = req;
    const { id } = params;
    console.log(id);
    let condition = { isDeleted: false, _id: Types.ObjectId(id) };
    const data = await UserModel.aggregate([
      {
        $match: condition,
      },
      {
        $addFields: {
          fullName: {
            $concat: [
              '$firstName',
              ' ',
              { $ifNull: ['$middleName', ''] },
              ' ',
              '$lastName',
            ],
          },
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      message: Message.ViewSuccess.replace(':item', 'User'),
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: Message.UnexpectedError,

      error: error.message,
    });
  }
};
/**
 ---------------------------
    REPORTING PERSON LIST
 ---------------------------

 * @api {get} auth/reporting-person-list      Get Reporting Person list  
 * @apiName reportingPerson
 * @apiGroup Auth
 * @apiDescription Api To get Reporting Person List 
 * @apiPermission Admin/Employee
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *   message: 'Reporting Person list fetched Successfully',
 *   data: data,
 *   totalRecords,
 *   success: true
 * }
 * @apiErrorExample {json}  error
 *    HTTP/1.1 500 Unknown Error
 * {
 *    message: "Unexpected error occurred"
 *    success: false,
 *    
 * }
 */
const reportingPerson = async (req, res) => {
  try {
    let condition = { isDeleted: false, status: 'Active' };
    const data = await UserModel.aggregate([
      {
        $match: condition,
      },
      {
        $addFields: {
          fullName: {
            $concat: [
              '$firstName',
              ' ',
              { $ifNull: ['$middleName', ''] },
              ' ',
              '$lastName',
            ],
          },
        },
      },
      {
        $project: {
          _id: 0,
          label: '$fullName',
          value: '$_id',
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      message: Message.ListFetchSuccess.replace(':item', 'Reporting Person'),
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: Message.UnexpectedError,

      error: error.message,
    });
  }
};
/**
 -----------------------
      UPDATE USER
 -----------------------
 */
/**
 * @api {put} auth/update-user/:id  Update User
 * @apiName updateUser
 * @apiGroup Auth
 * @apiPermission admin
 * @apiDescription Update API for User
 * @apiParam {String} firstName First name of User.
 * @apiParam {String} lastName Last name of User.
 * @apiParam {String} middleName Middle name of User.
 * @apiParam {String} email email of User.
 * @apiParam {String} role role of User.
 * @apiParam {String} gender gender of User.
 * @apiParam {String} designation designation of User.
 * @apiParam {String} department department of User.
 * @apiParam {Array} reportingPerson reportingPerson of User.
 * @apiParam {String} reason reason  for leave.
 * @apiParamExample {Object} Request-Example:
{
    
      "firstName":"mohan",
      "lastName":"thakur",
      "email":"mohanroy1@mailinator.com",
      "middleName":"singh",
     "department":"Engineering",
      "role":"Employee",
      "reportingPerson":["616804ff21f032a210461e8d"],
      "gender":"Male"
}
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
* {
 *   responseCode: 200,
      data: result,
      message: 'User Updated successfully.',
      success: true,
 * }
 * @apiErrorExample {json} List error
 *  HTTP/1.1 404 NotFound
 * {
       message: "User Not Found."
 * }
 *    HTTP/1.1 500 Internal Server Error
 */
const updateUser = async (req, res) => {
  const errors = CheckValidation(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: ValidationFormatter(errors.mapped()),
      success: false,
    });
  }
  try {
    const {
      params: { id },
      body,
      currentUser,
    } = req;
    const {
      firstName,
      lastName,
      middleName,
      role,
      department,
      reportingPerson,
      gender,
      designation,
    } = body;
    // let { removeReportingPerson = [] } = body;
    // removeReportingPerson = removeReportingPerson.filter(
    //   (item) => !reportingPerson.includes(item)
    // );

    const user = await UserModel.findOne({ _id: id }, { _id: 1 });
    if (!user) {
      return res.status(404).json({
        message: Message.NotFound.replace(':item', 'User'),
        success: false,
      });
    }
    const data = {
      firstName,
      lastName,
      middleName,
      designation,
      role,
      gender,
      department,
      modifiedBy: currentUser.userId,
    };
    const result = await UserModel.updateOne(
      { _id: id },
      {
        $set: data,
        $addToSet: {
          reportingPerson,
        },
      },
      { runValidators: true } // For run enum mongoose validation.
    );
    // const removeReportingPersonData = await UserModel.updateOne(
    //   { _id: id },
    //   {
    //     $pull: { reportingPerson: { $in: removeReportingPerson } },
    //   }
    // );

    return res.status(200).json({
      success: true,
      message: Message.UpdateSuccess.replace(':item', 'User'),
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: Message.UnexpectedError,
      error: error.message,
    });
  }
};
/**
 -----------------------
   UPDATE USER PROFILE
 -----------------------
 */
/**
 * @api {put} auth/update-profile  Update User Profile
 * @apiName updateProfile
 * @apiGroup Auth
 * @apiPermission admin/Employee
 * @apiDescription Update API for User Profile
 * @apiParam {String} firstName First name of User.
 * @apiParam {String} lastName Last name of User.
 * @apiParam {String} middleName Middle name of User.
 * @apiParam {String} email email of User.
 * @apiParam {String} role role of User.
 * @apiParam {String} gender gender of User.
 * @apiParam {String} designation designation of User.
 * @apiParam {String} department department of User.
 * @apiParam {Array} reportingPerson reportingPerson of User.
 * @apiParam {String} reason reason  for leave.
 * @apiParamExample {Object} Request-Example:
{
    
      "firstName":"mohan",
      "lastName":"thakur",
      "email":"mohanroy1@mailinator.com",
      "middleName":"singh",
     "department":"Engineering",
      "role":"Employee",
      "reportingPerson":["616804ff21f032a210461e8d"],
      "gender":"Male"
}
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
* {
 *   responseCode: 200,
      data: result,
      message: 'Profile Updated successfully.',
      success: true,
 * }
 * @apiErrorExample {json} List error
 *  HTTP/1.1 404 NotFound
 * {
       message: "User Not Found."
 * }
 *    HTTP/1.1 500 Internal Server Error
 */
const updateProfile = async (req, res) => {
  try {
    const { body, currentUser } = req;
    const {
      firstName,
      lastName,
      middleName,
      // role,
      // department,
      // reportingPerson,
      // designation,
      // gender,
    } = body;
    const user = await UserModel.findOne(
      { _id: currentUser.userId },
      { _id: 1 }
    );
    if (!user) {
      return res.status(404).json({
        message: Message.NotFound.replace(':item', 'User'),
        success: false,
      });
    }
    const data = {
      firstName,
      lastName,
      middleName,
      // role,
      // designation,
      // gender,
      // department,
      modifiedBy: currentUser.userId,
    };
    const result = await UserModel.updateOne(
      { _id: currentUser.userId },
      {
        $set: data,
        $addToSet: {
          reportingPerson,
        },
      },
      { runValidators: true } // For run enum mongoose validation.
    );

    return res.status(200).json({
      success: true,
      message: Message.UpdateSuccess.replace(':item', 'Profile'),
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: Message.UnexpectedError,
      error: error.message,
    });
  }
};

/**
 ---------------------------
    CURRENT USER VIEW
 ---------------------------

 * @api {get} auth/me      Get a current user Details  
 * @apiName me
 * @apiGroup Auth
 * @apiDescription Api To get current User Details 
 * @apiPermission Admin
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *   message: 'Profile Details fetched Successfully',
 *   data: data,
 *   success: true
 * }
 * @apiErrorExample {json}  error
 *    HTTP/1.1 404 Unknown Error
 * {
 *    message: "User Not Found."
 *    success: false,
 *    
 * }
 *    HTTP/1.1 500 Unknown Error
 * {
 *    message: "Unexpected error occurred"
 *    success: false,
 *    
 * }
 */
const me = async (req, res) => {
  try {
    const { currentUser } = req;

    const data = await UserModel.findOne({ _id: currentUser.userId });
    if (!data) {
      return res.status(404).json({
        message: Message.NotFound.replace(':item', 'User'),
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      message: Message.ViewSuccess.replace(':item', 'Profile'),
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: Message.UnexpectedError,
      error: error.message,
    });
  }
};
/**
 -----------------------
   UPDATE USER STATUS
 -----------------------
 */
/**
 * @api {patch} auth/update-status/:id  Update Status of User
 * @apiName updateUserStatus
 * @apiGroup Auth
 * @apiPermission admin
 * @apiDescription  API for Update Status of User
 * @apiParam {String} status status of User.
 * @apiParamExample {Object} Request-Example:
{
    
      "status":"Inactive",
    
}
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
* {
      data: data,
      message: 'User status updated successfully.',
      success: true,
 * }
 * @apiErrorExample {json} List error
 *  HTTP/1.1 404 not Found
 * {
       message: "User Not Found"
       success: false
 * }
 *    HTTP/1.1 500 Internal Server Error
 */
const updateUserStatus = async (req, res) => {
  const errors = CheckValidation(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: ValidationFormatter(errors.mapped()),
      success: false,
    });
  }
  try {
    const {
      params: { id },
      body: { status },
      currentUser,
    } = req;

    const userData = await UserModel.findOne({ _id: id }, { _id: 1 });
    if (!userData) {
      return res.status(404).json({
        message: Message.NotFound.replace(':item', 'User'),
        success: false,
      });
    }
    const data = await UserModel.updateOne(
      { _id: id },
      {
        $set: {
          status,
          modifiedBy: currentUser.userId,
        },
      },
      { runValidators: true } // For run enum mongoose validation.
    );

    return res.status(200).json({
      success: true,
      message: Message.UpdateStatusSuccess.replace(':item', 'User'),
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: Message.UnexpectedError,

      error: error.message,
    });
  }
};
/**
 -----------------------
   CHANGE USER PASSWORD
 -----------------------
 */
/**
 * @api {put} auth/change-password  Change Password
 * @apiName changePassword
 * @apiGroup Auth
 * @apiPermission admin/Employee
 * @apiDescription  API for Change Password
 * @apiParam {String} oldPassword Old Password of User.
 * @apiParam {String} newPassword New Password of User.
 * @apiParamExample {Object} Request-Example:
{
    
      "oldPassword":"123456",
      "newPassword":"654321",
    
}
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
* {
 *   responseCode: 200,
      data: result,
      message: 'Password Changed successfully.',
      success: true,
 * }
 * @apiErrorExample {json} List error
 *  HTTP/1.1 400 PasswordNotMatched
 * {
       message: "Password did not Matched"
 * }
 *    HTTP/1.1 500 Internal Server Error
 */
const changePassword = async (req, res) => {
  try {
    const {
      body: { oldPassword, newPassword },
      currentUser,
    } = req;
    const user = await UserModel.findOne({
      _id: currentUser.userId,
    });
    if (!comparePassword(oldPassword, user.password)) {
      return res.status(400).json({
        success: false,
        message: Message.PasswordNotMatched,
      });
    }
    const salt = generateSalt();
    let password = encryptPassword(newPassword, salt);

    const result = await UserModel.updateOne(
      {
        _id: currentUser.userId,
      },
      {
        $set: {
          password,
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: Message.PasswordChanged,
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: Message.UnexpectedError,
      error: error.message,
    });
  }
};
/**
 -----------------------
      DELETE USER 
 -----------------------
 */
/**
 * @api {delete} auth/delete-user/:id  Delete User
 * @apiName userDelete
 * @apiGroup Auth
 * @apiPermission admin
 * @apiDescription  API for Delete User
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
* {
      data: result,
      message: 'User Changed successfully.',
      success: true,
 * }
 * @apiErrorExample {json} List error
 *    HTTP/1.1 500 Internal Server Error
 */
const userDelete = async (req, res) => {
  try {
    const {
      params: { id },
      currentUser,
    } = req;
    const result = await UserModel.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          isDeleted: true,
          modifiedBy: currentUser.userId,
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: Message.DeleteSuccess.replace(':item', 'User'),
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: Message.UnexpectedError,

      error: error,
    });
  }
};

export default {
  login,
  me,
  addUser,
  userList,
  userView,
  userDelete,
  changePassword,
  updateUser,
  reportingPerson,
  updateProfile,
  updateUserStatus,
  forgotPassword,
};
