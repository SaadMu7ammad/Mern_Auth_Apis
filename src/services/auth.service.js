import { BadRequestError } from '../errors/bad-request.js';
import { NotFoundError } from '../errors/not-found.js';
import { UnauthenticatedError } from '../errors/unauthenticated.js';
import { User } from '../models/userModel.js';

const authUser = async (email, password) => {
  if (!email || !password) throw new BadRequestError('data incomplete for login');
  const user = await User.findOne({ email: email });
  if (!user) throw new NotFoundError('email not found');

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new UnauthenticatedError('invalid password');
  }
  return user;
};

const registerUser = async (name, email, password) => {
  if (!name || !email || !password)
    throw new BadRequestError('data incomplete for registering');

  const userExist = await User.findOne({ email: email });
  if (userExist) throw new BadRequestError('user is registered already');
  const user = await User.create({name,email,password});
  return user;
};

export const authService = {
  authUser,
  registerUser,
};
