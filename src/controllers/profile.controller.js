import asyncHandler from 'express-async-handler';
import { profileService } from '../services/profile.service.js';

//get /api/users/profile
const getUserProfile = asyncHandler(async (req, res, next) => {
  // const user = { ...req.user._doc };
  const user = profileService.getUserProfile(req);
  res.status(200).json(user);
});

//put /api/users/profile
const updateUserProfile = asyncHandler(async (req, res, next) => {
  const updatedUser = await profileService.updateUserProfile(
    req.user,
    req.body
  );
  res.status(200).json(updatedUser);
});
export { getUserProfile, updateUserProfile };
