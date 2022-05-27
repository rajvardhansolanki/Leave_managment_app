import { SettingModel, UserModel, LeaveRequestModel } from '../../models';

import { Message, Constant } from '../../common';
import { CheckValidation, ValidationFormatter } from '../../utils';
import { Types } from 'mongoose';
import constant from '../../common/constant';

/**
 ---------------------------
         DASHBOARD
 ---------------------------
 */

/**
 * @api {get} dashboard/  Dashboard details
 * @apiName settingView
 * @apiGroup Setting
 * @apiPermission admin
 * @apiDescription To fetch a Setting details
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 * {
 *    message:"Setting details fetched successfully",
 *    responseCode: 200
 *    data: result
 *    success: true
 * }
 * @apiErrorExample {json} List error

 *    HTTP/1.1 500 Internal Server Error
 */
const userAndLeaveCount = async (req, res) => {
  try {
    const user = await UserModel.aggregate([
      {
        $match: {
          isDeleted: false,
        },
      },
      {
        $facet: {
          totalUsers: [
            {
              $count: 'count',
            },
          ],
          totalEmployees: [
            {
              $match: {
                status: 'Active',
                role: 'Employee',
              },
            },
            {
              $count: 'count',
            },
          ],
          totalAdmin: [
            {
              $match: {
                status: 'Active',
                role: 'Admin',
              },
            },
            {
              $count: 'count',
            },
          ],
          totalActiveUser: [
            {
              $match: {
                status: 'Active',
              },
            },
            {
              $count: 'count',
            },
          ],
          totalUnActiveUser: [
            {
              $match: {
                status: 'Inactive',
              },
            },
            {
              $count: 'count',
            },
          ],
        },
      },
    ]);
    const leaveRequest = await LeaveRequestModel.aggregate([
      {
        $facet: {
          totalRequestedLeaves: [
            {
              $count: 'count',
            },
          ],
          pendingLeaves: [
            {
              $match: {
                status: 'Pending',
              },
            },
            {
              $count: 'count',
            },
          ],
          approvedLeaves: [
            {
              $match: {
                status: 'Approved',
              },
            },
            {
              $count: 'count',
            },
          ],
          disapprovedLeaves: [
            {
              $match: {
                status: 'Disapproved',
              },
            },
            {
              $count: 'count',
            },
          ],
        },
      },
    ]);

    const paidLeaves = constant.paidLeaves;
    const data = {
      totalUsers:
        user[0].totalUsers && user[0].totalUsers.length
          ? user[0].totalUsers[0].count
          : 0,
      totalEmployees:
        user[0].totalEmployees && user[0].totalEmployees.length
          ? user[0].totalEmployees[0].count
          : 0,
      totalAdmin:
        user[0].totalAdmin && user[0].totalAdmin.length
          ? user[0].totalAdmin[0].count
          : 0,
      totalActiveUser:
        user[0].totalActiveUser && user[0].totalActiveUser.length
          ? user[0].totalAdmin[0].count
          : 0,
      totalUnActiveUser:
        user[0].totalUnActiveUser && user[0].totalUnActiveUser.length
          ? user[0].totalUnActiveUser[0].count
          : 0,
      totalRequestedLeaves:
        leaveRequest[0].totalRequestedLeaves &&
        leaveRequest[0].totalRequestedLeaves.length
          ? leaveRequest[0].totalRequestedLeaves[0].count
          : 0,
      pendingLeaves:
        leaveRequest[0].pendingLeaves && leaveRequest[0].pendingLeaves.length
          ? leaveRequest[0].pendingLeaves[0].count
          : 0,
      approvedLeaves:
        leaveRequest[0].approvedLeaves && leaveRequest[0].approvedLeaves.length
          ? leaveRequest[0].approvedLeaves[0].count
          : 0,
      disapprovedLeaves:
        leaveRequest[0].disapprovedLeaves &&
        leaveRequest[0].disapprovedLeaves.length
          ? leaveRequest[0].disapprovedLeaves[0].count
          : 0,
      paidLeaves,
    };
    return res.status(200).json({
      success: true,
      data,
      message: Message.ListFetchSuccess.replace(
        ':item',
        'User and Leave Count'
      ),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: Message.UnexpectedError,
      error: error.message,
    });
  }
};

export default {
  userAndLeaveCount,
};
