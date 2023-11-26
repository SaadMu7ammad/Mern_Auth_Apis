import { User } from '../../models/userModel.js';
import { generateToken } from '../../utils/generateToken.js';
import { authService } from '../../services/auth.service.js';
import { UnauthenticatedError } from '../../errors/unauthenticated.js';
import { BadRequestError } from '../../errors/bad-request.js';

// import { generateToken } from '../utils/generateToken.js';
// import { jest } from '@jest/globals';
// jest.mock('express-async-handler', () => ({
//   __esModule: true,
//   default: jest.fn().mockImplementation((cb) => cb),
// }));
// jest.mock('../utils/generateToken.js', () => ({
//   generateToken: jest.fn(),
// }));

// const generateToken = jest.fn().mockReturnValue('jwt');
// beforeEach(async () => {
//   jest.resetAllMocks();
// });
// beforeAll(async () => {
//   const obj = {
//     name: 'saadmo',
//     email: 'saad1@gmail.com',
//     password: '123',
//   };

//   const userExist = await User.findOne({ email: obj.email });

//   if (!userExist) {
//     const res = await request(server).post('/api/users').send(obj);
//   }
//   //for testing creating a new user so we delete it before the testing to add it again to the db
//   await User.findOneAndDelete({ email: 'saad2@gmail.com' });
// });

// jest.mock('../../utils/generateToken.js', () => ({
//   generateToken: jest.fn().mockReturnValue('jwt'),
// }));

jest.mock('../../models/userModel.js', () => ({
  User: {
    findOne: jest.fn(),
    create: jest.fn(),
  },
}));

// afterAll(async () => {
//   await mongoose.disconnect();
//   server.close();
// });
jest.mock('../../utils/generateToken.js', () => ({
  generateToken: jest.fn().mockReturnValue('jwt')
}));
describe('unit testing for register user', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should throw error when no data sent', async () => {
    try {
      const result = await authService.registerUser();
    } catch (err) {
      expect(err).toBeInstanceOf(BadRequestError);
      expect(err.statusCode).toBe(400);
      expect(err.name).toBe('Error');
    }
    // await expect(result).toBe();

    // User.findOne = jest.fn().mockResolvedValue(true);
    // const req = {};
    // expect(async () => await registerUser(req)).rejects.toThrow();
    // User.findOne.mockReset();
  });
  it('should throw error when user is exist', async () => {
    //   User.findOne=jest.fn().mockResolvedValue({ name: 'user' });
    User.findOne.mockResolvedValue({ name: 'user' });
    try {
      await authService.registerUser('user', 'user@gmail.com', 'password');
    } catch (err) {
      expect(err).toBeInstanceOf(BadRequestError);
      expect(err.statusCode).toBe(400);
      expect(err.name).toBe('Error');
    }
    // await expect(result).toBe();

    // User.findOne = jest.fn().mockResolvedValue(true);
    // const req = {};
    // expect(async () => await registerUser(req)).rejects.toThrow();
    // User.findOne.mockReset();
  });
    it('when user not created after while regestering', async () => {
      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue(null);

      const req = {};
      req.body = {
        name: 'user',
        email: 'user@gmail.com',
        password: 'password',
      };
      // expect(async () => await registerUser(req)).rejects.toThrow();
      try {
        await authService.registerUser(req);
        fail('Expected the function to throw a BadRequestError');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestError);
        expect(error.name).toBe('Error');
      }
      
    });
    it('creating a user successfully', async () => {
      const user = {
        name: 'user',
        email: 'user@gmail.com',
        password: 'password',
      };
      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue(user);
      const req = {};
      req.body = {
        name: 'user',
        email: 'user@gmail.com',
        password: 'password',
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnValue(req.body),
      };
      // generateToken.mockReturnValue(true);
      const checkerObj = {
        name: 'user',
        email: 'user@gmail.com',
        password: 'password',
      };
      await expect(authService.registerUser(checkerObj.name,checkerObj.email,checkerObj.password)).resolves.toEqual(checkerObj);
    });
});

// describe('unit test for auth user', () => {
//   it('when email is not found while login', async () => {
//     User.findOne = jest.fn().mockResolvedValue(null);
//     const req = {
//       body: {
//         email: 'dummy@gmail.com',
//       },
//     };
//     try {
//       await authUser(req);
//       throw new BadRequestError('email exists and must be not');
//     } catch (error) {
//       expect(error).toBeInstanceOf(NotFoundError);
//       expect(error.statusCode).toBe(404);
//       expect(error.name).toBe('Error');
//     }
//     User.findOne.mockReset();
//     jest.resetAllMocks();
//   });
//   it('when email is found but password is incorrect', async () => {
//     const user = {
//       name: 'saad',
//     };
//     User.findOne = jest.fn().mockResolvedValue(user);
//     user.comparePassword = jest.fn().mockResolvedValue(false);
//     const req = {
//       body: {
//         email: 'saad1@gmail.com',
//         password: '111',
//       },
//     };
//     try {
//       await authUser(req);
//       throw new BadRequestError('email exists and must be not');
//     } catch (error) {
//       expect(error).toBeInstanceOf(UnauthenticatedError);
//       expect(error.statusCode).toBe(401);
//       expect(error.name).toBe('Error');
//     }
//     User.findOne.mockReset();
//     jest.resetAllMocks();
//   });
//   it('when email is found and password is correct', async () => {
//     const user = {
//       name: 'saad',
//     };
//     User.findOne = jest.fn().mockResolvedValue(user);
//     user.comparePassword = jest.fn().mockResolvedValue(true);
//     const req = {
//       body: {
//         name: 'ss',
//         email: 'saad2@gmail.com',
//         password: '123',
//       },
//     };
//     const res = {
//       status: jest.fn().mockReturnThis(),
//       json: jest.fn().mockReturnValue(req.body),
//     };
//     generateToken.mockReturnValue(true);
//     const checkerObj = {
//       name: 'ss',
//       email: 'saad2@gmail.com',
//       password: '123',
//     };
//     await expect(authUser(req, res)).resolves.toEqual(checkerObj);

//     User.findOne.mockReset();
//     generateToken.mockReset();
//     user.comparePassword.mockReset();
//     jest.resetAllMocks();
//   });
// });
