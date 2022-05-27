import { SettingModel, UserModel } from '../../models';

import { Message } from '../../common';
import { CheckValidation, ValidationFormatter } from '../../utils';
import { Types } from 'mongoose';

/**
 ---------------------------
      VIEW SETTING DETAILS
 ---------------------------
 */

/**
 * @api {get} setting/  Setting details
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
const settingView = async (req, res) => {
  try {
    const result = await SettingModel.find({});
    return res.status(200).json({
      success: true,
      message: Message.ViewSuccess.replace(':item', 'Setting'),
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
    UPDATE SETTING 
 -----------------------
 */
/**
 * @api {put} setting/:id  Update Setting Details
 * @apiName updateSetting
 * @apiGroup Setting
 * @apiPermission admin
 * @apiDescription Update API for Setting Details
 * @apiParam {String} websiteUrl url of the org.
 * @apiParam {String} youtubeUrl url of the org youtube chanel.
 * @apiParam {String} linkedinUrl url of the org linkedin account.
 * @apiParam {String} twitterUrl url of the org twitterUrl account.
 * @apiParam {String} orgName name of organization.
 * @apiParam {Array} email emails of org.
 * @apiParam {Array} removeEmail emails to remove of org.
 * @apiParamExample {Object} Request-Example:
{
     websiteUrl:"www.chapter247.com",
      youtubeUrl:"www.youtube.com/chapter247",
      linkedinUrl:"www.linkedin.com/chapter247",
      twitterUrl:"www.twitter.com/chapter247",
      orgName:"chapter247",
      email:["hr@chapter247.com"] ,
}
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
* {
 *   responseCode: 200,
      data: result,
      message: 'Setting details updated successfully.',
      success: true,
 * }
 * @apiErrorExample {json} List error

 *  HTTP/1.1 400 notPermitted
 * {
 *     code: 400,
       message: "You are not permitted to update Setting",
      success: false,
 * }
 *  HTTP/1.1 404 notFound
 * {
 * 
       message: "Data not found",
      success: false,
 * }
 *    HTTP/1.1 500 Internal Server Error
 */
const updateSetting = async (req, res) => {
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
      websiteUrl,
      youtubeUrl,
      linkedinUrl,
      twitterUrl,
      orgName,
      email = [],
    } = body;
    // let { removeEmail = [] } = body;
    // removeEmail = removeEmail.filter((item) => !email.includes(item));
    if (currentUser.role !== 'Admin') {
      return res.status(400).json({
        message: Message.notPermitted.replace(':item', 'Setting'),
        success: false,
      });
    }
    const setting = await SettingModel.findOne({ _id: id }, { _id: 1 });
    if (!setting) {
      return res.status(404).json({
        message: Message.NotFound.replace(':item', 'Data'),
        success: false,
      });
    }
    const data = {
      websiteUrl,
      youtubeUrl,
      linkedinUrl,
      twitterUrl,
      orgName,

      modifiedBy: currentUser.userId,
    };
    const result = await SettingModel.updateOne(
      { _id: id },
      {
        $set: data,
        $addToSet: {
          email,
        },
      },
      { runValidators: true } // For run enum mongoose validation.
    );
    // const removeEmailData = await SettingModel.updateOne(
    //   { _id: id },
    //   {
    //     $pull: { email: { $in: removeEmail } },
    //   }
    // );
    return res.status(200).json({
      success: true,
      message: Message.UpdateSuccess.replace(':item', 'Setting'),
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
export default {
  settingView,
  updateSetting,
};
