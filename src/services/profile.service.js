import { UnauthenticatedError } from "../errors/index.js";
import { User } from "../models/userModel.js";

const getUserProfile = (req) => {
  return req.user._doc;
};
const updateUserProfile = async (reqUser, reqBody) => {
  const user = await User.findById(reqUser._id);

  if (!user) throw new UnauthenticatedError('not found an id');

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
