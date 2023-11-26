import { User } from '../../models/userModel.js';
import { profileService } from '../../services/profile.service.js';

jest.mock('../../models/userModel.js', () => ({
  User: {
    findById: jest.fn(),
    save: jest.fn(),
  },
}));

describe('unit test for get profile', () => {
  it('cant get a user', () => {
    expect(() => profileService.getUserProfile(null)).toThrow('user not exist');
  });
  it('user exist', () => {
    const req = {
      user: {
        _doc: 'dummy',
      },
    };
    expect(() => profileService.getUserProfile({ req })).not.toThrow(
      'user not exist'
    );
  });
});

describe('unit test for update profile', () => {
  it('cant get a user', async () => {
    await expect(profileService.updateUserProfile(null, null)).rejects.toThrow(
      'user not exist'
    );
  });
  it('cant get a user id from the db', async () => {
    User.findById.mockResolvedValue(false);

    await expect(profileService.updateUserProfile(true, true)).rejects.toThrow(
      'not found an id'
    );
  });
  it('user founded in the db', async () => {
    const user = {
      name: 'test',
      email: 'test@gmail.com',
      password: 'password',
    };
    User.findById.mockResolvedValue(user);
    user.save = jest.fn().mockResolvedValue(user);
    await expect(
      profileService.updateUserProfile(true, true)
    ).resolves.not.toThrow('not found an id');
  });
});
