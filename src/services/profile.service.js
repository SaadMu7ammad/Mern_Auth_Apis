import { NotFoundError, UnauthenticatedError } from '../errors/index.js';
import { User } from '../models/userModel.js';

const getUserProfile = (req) => {
  if (!req) throw new NotFoundError('user not exist');

  return req.user._doc;
};
const updateUserProfile = async (reqUser, reqBody) => {
    // const { user: reqUser, body: reqBody } = req;

  if (!reqUser) throw new NotFoundError('user not exist');

  const user = await User.findById(reqUser._id);

  if (!user) throw new UnauthenticatedError('not found an id');
  console.log('yyyyyyyyyyyyyyyyy');
console.log(reqBody);
  user.name = reqBody.name || user.name;
  user.email = reqBody.email || user.email;
  if (reqBody.password) user.password = reqBody.password;
  const updatedUser = await user.save();
  return updatedUser;
};

export const profileService = {
  getUserProfile,
  updateUserProfile,
};
