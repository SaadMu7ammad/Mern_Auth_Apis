import express, { Router } from 'express';

const authRouter = express.Router();
import {
  authUser,
  registerUser,
  logoutUser,
 
} from '../controllers/auth.controller.js';
import { auth } from '../middlewares/authMiddleware.js';
authRouter.post('/', registerUser);
authRouter.post('/auth', authUser);
authRouter.post('/logout', logoutUser);

export { authRouter};
