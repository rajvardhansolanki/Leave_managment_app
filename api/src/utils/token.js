import jwt from 'jsonwebtoken';
import { UserModel } from '../models';
import { Message } from '../common';
const config = process.env;

const verifyToken = async (req, res, next) => {
  var token =
    req.body.authorization ||
    req.query.authorization ||
    req.headers['authorization'];

  if (!token) {
    return res.status(403).send('A token is required for authentication');
  }
  try {
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    req.currentUser = decoded;

    // const currentUser = await UserModel.findOne({
    //   _id: decoded.userId,
    //   role: 'Admin',
    //   isActive: true,
    //   isDeleted: false,
    // });
    //  console.log(decoded);
    // console.log(currentUser);
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: Message.UnexpectedError,
      error: err.message,
    });
  }
  return next();
};

export { verifyToken };
