import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { User } from './schema/user.schema';
import { Chance } from 'chance';

const chance = new Chance();

describe('UserService', () => {
  let userService: UserService;

  const mockUserModel = {
    findOne: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);

    jest.clearAllMocks();
  });

  describe('findByEmail', () => {
    it('should return a user if found', async () => {
      const email = chance.email({ domain: 'gmail.com' });
      const user = { email } as User;

      mockUserModel.findOne.mockResolvedValue(user);

      const result = await userService.findByEmail(email);

      expect(result).toEqual(user);
      expect(mockUserModel.findOne).toHaveBeenCalledWith({ email });
      expect(mockUserModel.findOne).toHaveBeenCalledTimes(1);
    });

    it('should return null if no user is found', async () => {
      const email = 'test@example.com';

      mockUserModel.findOne.mockResolvedValue(null);

      const result = await userService.findByEmail(email);

      expect(result).toBeNull();
      expect(mockUserModel.findOne).toHaveBeenCalledWith({ email });
      expect(mockUserModel.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('createUser', () => {
    it('should create and return a user', async () => {
      const userDto = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
      };
      const createdUser = { ...userDto } as User;

      mockUserModel.create.mockResolvedValue(createdUser);

      const result = await userService.createUser(userDto);

      expect(result).toEqual(createdUser);
      expect(mockUserModel.create).toHaveBeenCalledWith(userDto);
      expect(mockUserModel.create).toHaveBeenCalledTimes(1);
    });
  });
});
