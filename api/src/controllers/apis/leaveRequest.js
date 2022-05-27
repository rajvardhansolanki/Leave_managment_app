import { UserModel, LeaveRequestModel, SettingModel } from '../../models';

import { Message, Constant } from '../../common';
import {
  Email,
  AvailableTemplates,
  CheckValidation,
  ValidationFormatter,
} from '../../utils';
import { Types } from 'mongoose';

/**
 -----------------------
    ADD LEAVE REQUEST
 -----------------------
 */
/**
 * @api {post} leave-request/add  Add Leave Request
 * @apiName addLeaveRequest
 * @apiGroup LeaveRequest
 * @apiPermission admin/employee
 * @apiDescription Add API for Leave Request
 * @apiParam {String} datesToRequest Requested dates for leave.
 * @apiParam {String} reason reason  for leave.
 * @apiParamExample {Object} Request-Example:
{
    
      reason:"fever",
      datesToRequest:["2021-10-10","2021-10-11"] ,
}
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
* {
 *   responseCode: 200,
      data: result,
      message: 'Leave Request Added successfully.',
      success: true,
 * }
 * @apiErrorExample {json} List error

 *  HTTP/1.1 400 notFound
 * {
       message: "Your account is deactivated please contact to admin",
      success: false,
 * }
 *    HTTP/1.1 500 Internal Server Error
 */
const addLeaveRequest = async (req, res) => {
  const errors = CheckValidation(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: ValidationFormatter(errors.mapped()),
      success: false,
    });
  }
  try {
    const { body, currentUser } = req;
    const { datesToRequest, reason, leaveType } = body;

    const user = await UserModel.findOne({
      _id: currentUser.userId,
      isDeleted: false,
      status: 'Active',
    });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: Message.AccountDeactivated,
      });
    }
    const data = {
      datesToRequest,
      reason,
      // leaveType,
      userId: currentUser.userId,
      createdBy: currentUser.userId,
    };

    const leaveRequestData = new LeaveRequestModel(data);
    const result = await leaveRequestData.save();
    try {
      const reportingPerson = await UserModel.find(
        {
          _id: { $in: currentUser.reportingPerson },
          isDeleted: false,
          status: 'Active',
        },
        { email: 1, _id: 0 }
      );
      let reportingPersonEmail = [];
      for (const iterator of reportingPerson) {
        await reportingPersonEmail.push(iterator.email.toString());
      }

      const setting = await SettingModel.find({});
      let hrEmail = setting[0].email;
      console.log('hrEmail', hrEmail);
      const emailSend = new Email();
      await emailSend.setCC(reportingPersonEmail);
      await emailSend.setTemplate(AvailableTemplates.LEAVE_REQUEST, {
        name: `${user.firstName} ${user.lastName} `,
        reason,
        datesToRequest,
      });
      await emailSend.sendEmail(hrEmail);
    } catch (error) {
      return res.status(201).json({
        message: error.message,
        isAdded: true,
      });
    }
    return res.status(200).json({
      success: true,
      message: Message.AddSuccess.replace(':item', 'Leave Request'),
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
 -------------------------
   GET ALL LEAVE REQUEST
 -------------------------
 */

/**
 * @api {get} leave-request/list  Get Leave Request list
 * @apiName leaveRequestList
 * @apiGroup LeaveRequest
 * @apiPermission admin
 * @apiDescription To fetch Leave Request details 
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *   message: Leave Request list fetched successfully
 *   responseCode: 200,
      data,
      totalRecords,
      success: true,
 * }
 * @apiErrorExample {json}  error
 *    HTTP/1.1 500 Internal Server Error
 */
const leaveRequestList = async (req, res, next) => {
  try {
    const { query } = req;

    const limit = query.limit ? parseInt(query.limit, 10) : 10;
    const page = query.page ? parseInt(query.page, 10) : 1;
    const skip = (page - 1) * limit;
    const { search, status, fromDate, toDate, userId } = query;

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
            'user.firstName': {
              $regex: new RegExp(search.trim(), 'i'),
            },
          },
          {
            fullName: {
              $regex: new RegExp(search.trim(), 'i'),
            },
          },
          {
            'user.lastName': {
              $regex: new RegExp(search.trim(), 'i'),
            },
          },
        ],
      };
    }

    if (status) {
      condition = {
        ...condition,
        status,
      };
    }
    if (userId) {
      condition = {
        ...condition,
        userId: Types.ObjectId(userId),
      };
    }

    if (fromDate && toDate) {
      condition = {
        ...condition,
        createdAt: dateCondition,
      };
    }

    const data = await LeaveRequestModel.aggregate([
      {
        $lookup: {
          from: 'users',
          as: 'user',
          foreignField: '_id',
          localField: 'userId',
        },
      },
      {
        $unwind: '$user',
      },
      {
        $addFields: {
          fullName: {
            $concat: [
              '$user.firstName',
              ' ',
              { $ifNull: ['$user.middleName', ''] },
              ' ',
              '$user.lastName',
            ],
          },
        },
      },

      {
        $match: condition,
      },
      {
        $project: {
          _id: 1,
          datesToRequest: 1,
          reason: 1,
          status: 1,
          fullName: 1,
        },
      },
      { $sort: { _id: -1 } },
      { $skip: skip },
      { $limit: limit },
    ]);
    const totalRecords = await LeaveRequestModel.aggregate([
      {
        $lookup: {
          from: 'users',
          as: 'user',
          foreignField: '_id',
          localField: 'userId',
        },
      },
      {
        $unwind: '$user',
      },
      {
        $addFields: {
          fullName: {
            $concat: [
              '$user.firstName',
              ' ',
              { $ifNull: ['$user.middleName', ''] },
              ' ',
              '$user.lastName',
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
      message: Message.ListFetchSuccess.replace(':item', 'Leave Request'),
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
 -------------------------
   GET A LEAVE REQUEST
 -------------------------
 */

/**
 * @api {get} leave-request/view/:id  Get Leave Request view
 * @apiName leaveRequestView
 * @apiGroup LeaveRequest
 * @apiPermission admin
 * @apiDescription To fetch Leave Request details 
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *   message: Leave Request details fetched successfully
      data,
      totalRecords,
      success: true,
 * }
 * @apiErrorExample {json}  error
 *    HTTP/1.1 500 Internal Server Error
 */
const leaveRequestView = async (req, res) => {
  try {
    const { params } = req;
    const { id } = params;
    let condition = { _id: Types.ObjectId(id) };
    const data = await LeaveRequestModel.aggregate([
      {
        $lookup: {
          from: 'users',
          as: 'user',
          foreignField: '_id',
          localField: 'userId',
        },
      },
      {
        $unwind: '$user',
      },
      {
        $addFields: {
          fullName: {
            $concat: [
              '$user.firstName',
              ' ',
              { $ifNull: ['$user.middleName', ''] },
              ' ',
              '$user.lastName',
            ],
          },
        },
      },

      {
        $match: condition,
      },
      {
        $project: {
          _id: 1,
          datesToRequest: 1,
          reason: 1,
          status: 1,
          fullName: 1,
        },
      },
    ]);
    return res.status(200).json({
      success: true,
      message: Message.ViewSuccess.replace(':item', 'Leave Request'),
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
 --------------------------------
     LEAVE REQUEST OF USER
 --------------------------------
 */

/**
 * @api {get} leave-request/by-user/:id  Get Leave Request view of user
 * @apiName leaveRequestByUser
 * @apiGroup LeaveRequest
 * @apiPermission admin/employee
 * @apiDescription To fetch Leave Request details of user
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *   message: Leave Request list fetched successfully
      data,
      totalRecords,
      success: true,
 * }
 * @apiErrorExample {json}  error
 *    HTTP/1.1 500 Internal Server Error
 */
const leaveRequestByUser = async (req, res) => {
  try {
    const { params } = req;
    const { id } = params;
    let condition = { userId: Types.ObjectId(id) };
    const data = await LeaveRequestModel.aggregate([
      {
        $lookup: {
          from: 'users',
          as: 'user',
          foreignField: '_id',
          localField: 'userId',
        },
      },
      {
        $unwind: '$user',
      },
      {
        $addFields: {
          fullName: {
            $concat: [
              '$user.firstName',
              ' ',
              { $ifNull: ['$user.middleName', ''] },
              ' ',
              '$user.lastName',
            ],
          },
        },
      },

      {
        $match: condition,
      },
      {
        $project: {
          _id: 1,
          datesToRequest: 1,
          reason: 1,
          status: 1,
          fullName: 1,
        },
      },
    ]);
    return res.status(200).json({
      success: true,
      message: Message.ListFetchSuccess.replace(':item', 'Leave Request'),
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
 --------------------------------
   LEAVE REQUEST OF CURRENT USER
 --------------------------------
 */

/**
 * @api {get} leave-request/me  Get Leave Request list of current user
 * @apiName myLeaveRequest
 * @apiGroup LeaveRequest
 * @apiPermission admin/employee
 * @apiDescription To fetch Leave Request details of current user
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *   message: Leave Request list fetched successfully
      data,
      totalRecords,
      success: true,
 * }
 * @apiErrorExample {json}  error
 *    HTTP/1.1 500 Internal Server Error
 */
const myLeaveRequest = async (req, res) => {
  try {
    const { currentUser } = req;

    let condition = { userId: Types.ObjectId(currentUser.userId) };
    const data = await LeaveRequestModel.aggregate([
      {
        $lookup: {
          from: 'users',
          as: 'user',
          foreignField: '_id',
          localField: 'userId',
        },
      },
      {
        $unwind: '$user',
      },
      {
        $addFields: {
          fullName: {
            $concat: [
              '$user.firstName',
              ' ',
              { $ifNull: ['$user.middleName', ''] },
              ' ',
              '$user.lastName',
            ],
          },
        },
      },

      {
        $match: condition,
      },
      {
        $project: {
          _id: 1,
          datesToRequest: 1,
          reason: 1,
          status: 1,
          fullName: 1,
        },
      },
      { $sort: { _id: -1 } }
    ]);
    return res.status(200).json({
      success: true,
      message: Message.ListFetchSuccess.replace(':item', 'Leave Request'),
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
 --------------------------------
    UPDATE LEAVE REQUEST STATUS
 --------------------------------
 */
/**
 * @api {patch} leave-request/update-status/:id  Update Leave Request status
 * @apiName updateLeaveStatus
 * @apiGroup LeaveRequest
 * @apiPermission admin
 * @apiDescription Update API for Leave Request status
 * @apiParam {String} status status to be updated for leave.
 * @apiParam {String} id id of leave request.
 * @apiParamExample {Object} Request-Example:
   {
    
      id:"44455522225544ff5",
      status:"Approved" ,
   }
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
* {
 *   responseCode: 200,
      data: data,
      message: 'Leave Request Status Updated successfully.',
      success: true,
 * }
 * @apiErrorExample {json} List error

 *  HTTP/1.1 400 notPermitted
 * {
       message: "Your are not permitted to update leave status",
      success: false,
 * }
 *    HTTP/1.1 500 Internal Server Error
 */

const updateLeaveStatus = async (req, res) => {
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

    if (currentUser.role === 'Employee') {
      return res.status(400).json({
        message: Message.notPermitted.replace(':item', 'Leave Status'),
        success: false,
      });
    }
    const data = await LeaveRequestModel.updateOne(
      { _id: id },
      {
        $set: {
          status,
          modifiedBy: currentUser.userId,
        },
      },
      { runValidators: true } // For run enum mongoose validation.
    );

    try {
      const leaveRequestData = await LeaveRequestModel.findOne({ _id: id });
      const userData = await UserModel.findOne({
        _id: leaveRequestData.userId,
      });
      const reportingPerson = await UserModel.find(
        {
          _id: { $in: userData.reportingPerson },
          isDeleted: false,
          status: 'Active',
        },
        { email: 1, _id: 0 }
      );
      let reportingPersonEmail = [];
      for (const iterator of reportingPerson) {
        await reportingPersonEmail.push(iterator.email.toString());
      }

      const emailSend = new Email();
      await emailSend.setCC(reportingPersonEmail);

      await emailSend.setTemplate(AvailableTemplates.LEAVE_STATUS, {
        name: `${userData.firstName} ${userData.lastName} `,
        status,
        reason: leaveRequestData.reason,
        datesToRequest: leaveRequestData.datesToRequest,
      });
      await emailSend.sendEmail(userData.email);
    } catch (error) {
      return res.status(201).json({
        message: error.message,
        isAdded: true,
      });
    }

    return res.status(200).json({
      success: true,
      message: Message.UpdateSuccess.replace(':item', 'Leave Request status'),
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
 * Export as a single common js module
 */
export default {
  addLeaveRequest,
  leaveRequestList,
  leaveRequestView,
  updateLeaveStatus,
  leaveRequestByUser,
  myLeaveRequest,
};
