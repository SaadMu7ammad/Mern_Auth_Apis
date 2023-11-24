// import { BadRequestError } from '../errors/bad-request.js';
import {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} from '../errors/index.js';
import asyncHandler from 'express-async-handler';
import { generateToken } from '../utils/generateToken.js';
import { User } from '../models/userModel.js';
import { authService } from '../services/auth.service.js';
//post /api/users/auth
const authUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await authService.authUser(email, password);
  generateToken(res, user._id);
  return res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
  });
});
// post /api/users/
const registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;
  const user=await authService.registerUser(name,email,password)
  if (user) {
    generateToken(res, user._id);
    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    throw new BadRequestError({ msg: 'Invalid data' });
  }
});

//post /api/users/logout
const logoutUser = asyncHandler(async (req, res, next) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ msg: 'logout' });
});

export { registerUser, authUser, logoutUser };
