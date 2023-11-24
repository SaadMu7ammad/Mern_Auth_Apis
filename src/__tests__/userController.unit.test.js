import {
  authUser,
  getUserProfile,
  myData,
  registerUser,
  sum,
} from '../Controllers/userController.js';
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
describe('get profile', () => {
  it('should equal the data returned', async () => {
    const jwtToken = process.env.JWTTOKEN;

    const res = await request(server)
      .get('/api/users/profile')
      .set('Cookie', [`jwt=${process.env.JWTTOKEN}`]);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('name', 'saadmo');
  });
});
describe('logout user', () => {
  it('should res a logout message', async () => {
    const res = await request(server).post('/api/users/logout');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('msg', 'logout');
  });
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

describe('unit testing for register user', () => {
  it('should throw error when user is register before', async () => {
    User.findOne = jest.fn().mockResolvedValue(true);
    const req = {};
    expect(async () => await registerUser(req)).rejects.toThrow();
    User.findOne.mockReset();
  });
  it('when creating a user had an internal error', async () => {
    User.findOne = jest.fn().mockResolvedValue(null);
    User.create = jest.fn().mockResolvedValue(null);

    const req = {};
    req.body = {
      name: 'ss',
      email: 'saad2@gmail.com',
      password: '123',
    };
    // expect(async () => await registerUser(req)).rejects.toThrow();
    try {
      await registerUser(req);
      fail('Expected the function to throw a BadRequestError');
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestError);
      expect(error.name).toBe('Error');
    }

    User.create.mockReset();
    User.findOne.mockReset();
  });
  it('when creating a user had an internal error', async () => {
    const user = {
      name: 'ss',
      email: 'saad3@gmail.com',
      password: '123',
    };
    User.findOne = jest.fn().mockResolvedValue(null);
    User.create = jest.fn().mockResolvedValue(user);
    const req = {};
    req.body = {
      name: 'ss',
      email: 'saad2@gmail.com',
      password: '123',
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnValue(req.body),
    };
    generateToken.mockReturnValue(true);
    const checkerObj = {
      name: 'ss',
      email: 'saad2@gmail.com',
      password: '123',
    };
    await expect(registerUser(req, res)).resolves.toEqual(checkerObj);
    jest.resetAllMocks();
    User.create.mockReset();
    User.findOne.mockReset();
    generateToken.mockReset();
  });
});


describe('unit test for auth user', () => {
  it('when email is not found while login', async () => {
    User.findOne = jest.fn().mockResolvedValue(null);
    const req = {
      body: {
        email: 'dummy@gmail.com',
      },
    };
    try {
      await authUser(req);
      throw new BadRequestError('email exists and must be not');
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundError);
      expect(error.statusCode).toBe(404);
      expect(error.name).toBe('Error');
    }
    User.findOne.mockReset();
    jest.resetAllMocks();
  });
  it('when email is found but password is incorrect', async () => {
    const user = {
      name: 'saad',
    };
    User.findOne = jest.fn().mockResolvedValue(user);
    user.comparePassword = jest.fn().mockResolvedValue(false);
    const req = {
      body: {
        email: 'saad1@gmail.com',
        password: '111',
      },
    };
    try {
      await authUser(req);
      throw new BadRequestError('email exists and must be not');
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthenticatedError);
      expect(error.statusCode).toBe(401);
      expect(error.name).toBe('Error');
    }
    User.findOne.mockReset();
    jest.resetAllMocks();
  });
  it('when email is found and password is correct', async () => {
    const user = {
      name: 'saad',
    };
    User.findOne = jest.fn().mockResolvedValue(user);
    user.comparePassword = jest.fn().mockResolvedValue(true);
    const req = {
      body: {
        name: 'ss',
        email: 'saad2@gmail.com',
        password: '123',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnValue(req.body),
    };
    generateToken.mockReturnValue(true);
    const checkerObj = {
      name: 'ss',
      email: 'saad2@gmail.com',
      password: '123',
    };
    await expect(authUser(req, res)).resolves.toEqual(checkerObj);

    User.findOne.mockReset();
    generateToken.mockReset();
    user.comparePassword.mockReset();
    jest.resetAllMocks();
  });
});
