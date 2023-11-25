import express, { Router } from 'express';

const profileRouter = express.Router();
import {
  getUserProfile,
  updateUserProfile,
} from '../controllers/profile.controller.js';
import { auth } from '../middlewares/authMiddleware.js';
profileRouter.route('/').get(auth, getUserProfile).put(auth, updateUserProfile);

export { profileRouter };
