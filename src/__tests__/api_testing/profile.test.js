import { server } from '../../server.js';
import connectDB from '../../config/db.js';
import request from 'supertest';
import cookieParser from 'cookie-parser';

import { auth } from '../../middlewares/authMiddleware.js';
import { User } from '../../models/userModel.js';
import mongoose from 'mongoose';
import { generateToken } from '../../utils/generateToken.js';
import { authService } from '../../services/auth.service.js';

let token;
// let _id;
beforeEach(async () => {
  //register new user
  const obj = {
    name: 't',
    email: 't@gmail.com',
    password: 'password',
  };
  await User.findOneAndDelete({ email: 't@gmail.com' });
  // await User.insertMany(obj);

  await request(server).post('/api/users').send(obj);

  const loginResponse = await request(server).post('/api/users/auth').send(obj);

  token = loginResponse.body.token;
  // _id = loginResponse.body.id;
});
afterAll(async () => {
  await mongoose.disconnect();
  server.close();
});
describe('api testing for get profile ', () => {
  it('get a user profile with valid token', async () => {
    const res = await request(server)
      .get('/api/users/profile')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('name', 't');
  });
  it('get a user profile with corrupted token', async () => {
    const res = await request(server)
      .get('/api/users/profile')
      .set('Authorization', `Bearer ${null}`);
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('msg', 'Authentication invalid');
  });
});
describe('api testing for update profile ', () => {
  it('update a user profile with corrupted token', async () => {
    const res = await request(server)
      .put('/api/users/profile')
      .set('Authorization', `Bearer ${null}`);
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('msg', 'Authentication invalid');
  });
  it('update a user profile with valid token', async () => {
    const obj = {
      name: 't',
      email: 't@gmail.com',
      password: 'password',
    };
    const res = await request(server)
      .put('/api/users/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'newt' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('name', 'newt');
  });
});
