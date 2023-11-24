// // import { BadRequestError } from '../errors/bad-request.js';
// import {
//   BadRequestError,
//   NotFoundError,
//   UnauthenticatedError,
// } from '../errors/index.js';
// import asyncHandler from 'express-async-handler';
// import { generateToken } from '../utils/generateToken.js';
// import { User } from '../models/userModel.js';

// //get /api/users/profile
// //private>>needs token
// const getUserProfile = asyncHandler(async (req, res, next) => {
//   const user = { ...req.user._doc };
//   res.status(200).json(user);
// });

// //put /api/users/profile
// //private>>needs token
// const updateUserProfile = asyncHandler(async (req, res, next) => {
//   const user = await User.findById(req.user._id);

//   if (!user) throw new UnauthenticatedError('not found an id');

//   user.name = req.body.name || user.name;
//   user.email = req.body.email || user.email;
//   if (req.body.password) user.password = req.body.password;
//   const updatedUser = await user.save();
//   res.status(200).json(updatedUser);
// });
// export { getUserProfile, updateUserProfile };
