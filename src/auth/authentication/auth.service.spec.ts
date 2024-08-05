import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UserService } from '../../user/user.service';
import { User } from '../../user/schema/user.schema';
import { Chance } from 'chance';

const chance = new Chance();

describe('AuthService', () => {
  let authService: AuthService;

  const mockUserService = {
    findByEmail: jest.fn(),
    createUser: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);

    jest.clearAllMocks();
  });

  describe('storeUser', () => {
    it('should create a user if they do not exist', async () => {
      const profile = {
        user: {
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
        },
      };

      mockUserService.findByEmail.mockResolvedValue(null);
      mockUserService.createUser.mockResolvedValue({ ...profile.user } as User);

      const result = await authService.storeUser(profile);

      expect(result).toBe(true);
      expect(mockUserService.findByEmail).toHaveBeenCalledWith(
        profile.user.email,
      );
      expect(mockUserService.createUser).toHaveBeenCalledWith(profile.user);
    });

    it('should not create a user if they already exist', async () => {
      const profile = {
        user: {
          email: chance.email({ domain: 'example.com' }),
          firstName: chance.first(),
          lastName: chance.last(),
        },
      };

      mockUserService.findByEmail.mockResolvedValue({
        ...profile.user,
      } as User);

      const result = await authService.storeUser(profile);

      expect(result).toBe(true);
      expect(mockUserService.findByEmail).toHaveBeenCalledWith(
        profile.user.email,
      );
      expect(mockUserService.createUser).not.toHaveBeenCalled();
    });
  });

  describe('generateJwtToken', () => {
    it('should generate a JWT token', async () => {
      const user = {
        user: {
          email: 'test@example.com',
        },
      };
      const token = 'mocked-jwt-token';

      mockJwtService.sign.mockReturnValue(token);

      const result = await authService.generateJwtToken(user);

      expect(result).toBe(token);
      expect(mockJwtService.sign).toHaveBeenCalledWith(
        {
          email: user.user.email,
        },
        { expiresIn: '1h' },
      );
    });
  });

  describe('validateUser', () => {
    it('should return a user if they exist', async () => {
      const payload = { email: 'test@example.com' };
      const user = { email: 'test@example.com' } as User;

      mockUserService.findByEmail.mockResolvedValue(user);

      const result = await authService.validateUser(payload);

      expect(result).toBe(user);
      expect(mockUserService.findByEmail).toHaveBeenCalledWith(payload.email);
    });

    it('should return null if user does not exist', async () => {
      const payload = { email: 'nonexistent@example.com' };

      mockUserService.findByEmail.mockResolvedValue(null);

      const result = await authService.validateUser(payload);

      expect(result).toBeNull();
      expect(mockUserService.findByEmail).toHaveBeenCalledWith(payload.email);
    });
  });
});
