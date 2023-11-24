import {
  authUser,
  getUserProfile,
  myData,
  registerUser,
  sum,
} from '../controllers/auth.controller.js';
import dotenv from 'dotenv/config';

import { server } from '../server.js';
import connectDB from '../config/db.js';
import request from 'supertest';
import mockAsyncHandler from 'express-async-handler';

import {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} from '../errors/index.js';
import { auth } from '../middlewares/authMiddleware.js';
import asyncHandler from 'express-async-handler';
import { User } from '../models/userModel.js';
import mongoose from 'mongoose';
import { generateToken } from '../utils/generateToken.js';
// import { jest } from '@jest/globals';
// jest.mock('express-async-handler', () => ({
//   __esModule: true,
//   default: jest.fn().mockImplementation((cb) => cb),
// }));
jest.mock('../utils/generateToken.js', () => ({
  generateToken: jest.fn(),
}));
// beforeEach(async () => {
//   jest.resetAllMocks();
// });
beforeAll(async () => {
  const obj = {
    name: 'saadmo',
    email: 'saad1@gmail.com',
    password: '123',
  };

  const userExist = await User.findOne({ email: obj.email });

  if (!userExist) {
    const res = await request(server).post('/api/users').send(obj);
  }
  //for testing creating a new user so we delete it before the testing to add it again to the db
  await User.findOneAndDelete({ email: 'saad2@gmail.com' });
});
afterAll(async () => {
  await mongoose.disconnect();
  server.close();
});

describe('api testing for register user ', () => {
  it('should throw error when user is register before', async () => {
    const existingObj = {
      name: 'saadmo',
      email: 'saad1@gmail.com',
      password: '123',
    };
    const res = await request(server).post('/api/users').send(existingObj);
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('msg', 'user is registered already');
  });

  it('if the registerd user is new ', async () => {
    const newObj = {
      name: 'saadmo',
      email: 'saad2@gmail.com',
      password: '123',
    };
    const res = await request(server).post('/api/users').send(newObj);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('name', 'saadmo');
    expect(res.body).toHaveProperty('email', 'saad2@gmail.com');
  });
});
describe('api testing for auth user', () => {
  it('when email is not found while login', async () => {
    const existingObj = {
      email: 'saad1@gmail.com',
      password: '123',
    };
    const res = await request(server).post('/api/users/auth').send(existingObj);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('name', 'saadmo');
  });
});
