import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../authentication/auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../../user/user.service';
import { ConfigService } from '@nestjs/config';

jest.mock('./google.strategy', () => {
  return {
    GoogleStrategy: jest.fn().mockImplementation(() => ({
      validate: jest
        .fn()
        .mockImplementation((accessToken, refreshToken, profile, done) => {
          const { name, emails } = profile;
          const user = {
            email: emails[0].value,
            firstName: name.givenName,
            lastName: name.familyName,
            accessToken,
            refreshToken,
          };
          done(null, { user });
        }),
    })),
  };
});

import { GoogleStrategy } from './google.strategy';

describe('GoogleStrategy', () => {
  let strategy: GoogleStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GoogleStrategy,
        {
          provide: AuthService,
          useValue: {
            storeUser: jest.fn().mockResolvedValue(true),
            generateJwtToken: jest.fn().mockResolvedValue('mock-jwt-token'),
          },
        },
        {
          provide: UserService,
          useValue: {},
        },
        {
          provide: JwtService,
          useValue: {},
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('mock-secret'),
          },
        },
      ],
    }).compile();

    strategy = module.get<GoogleStrategy>(GoogleStrategy);
  });

  it('should validate and return user payload', async () => {
    const mockProfile = {
      name: { givenName: 'John', familyName: 'Doe' },
      emails: [{ value: 'LbqzH@example.com' }],
    };

    const done = jest.fn();
    await strategy.validate('accessToken', 'refreshToken', mockProfile, done);

    expect(done).toHaveBeenCalledWith(null, {
      user: {
        email: 'LbqzH@example.com',
        firstName: 'John',
        lastName: 'Doe',
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
      },
    });
  });
});
