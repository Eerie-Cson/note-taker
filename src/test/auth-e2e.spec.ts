import { Test } from '@nestjs/testing';
import { AuthService } from '../auth/authentication/auth.service';

import { mockAuthService, CustomAuthGuard, testToken } from './helper/mock';
import { AuthController } from '../auth/authentication/controllers/auth.controller';
import * as request from 'supertest';
import { AuthGuard } from '@nestjs/passport';

describe('AuthController', () => {
  let app;

  afterEach(async () => {
    await app.close();
  });

  describe('request is not empty', () => {
    beforeEach(async () => {
      const module = await Test.createTestingModule({
        controllers: [AuthController],
        providers: [
          {
            provide: AuthService,
            useValue: mockAuthService,
          },
        ],
      })
        .overrideGuard(AuthGuard('google'))
        .useClass(CustomAuthGuard)
        .compile();

      app = module.createNestApplication();
      await app.init();
    });
    it('should handle Google authentication and return a JWT token', async () => {
      const response = await request(app.getHttpServer())
        .get('/auth/google/callback')
        .expect(200);

      expect(response.body).toEqual({ token: testToken });
    });
  });

  describe('request is empty', () => {
    beforeEach(async () => {
      const module = await Test.createTestingModule({
        controllers: [AuthController],
        providers: [
          {
            provide: AuthService,
            useValue: mockAuthService,
          },
        ],
      })
        .overrideGuard(AuthGuard('google'))
        .useValue({ canHandle: () => true })
        .compile();

      app = module.createNestApplication();
      await app.init();
    });
    it('should redirect to error page if no user found', async () => {
      const mockAuthService = {
        storeUser: jest.fn(),
      };
      mockAuthService.storeUser.mockResolvedValue(null);

      await request(app.getHttpServer())
        .get('/auth/google/callback')
        .expect(302)
        .expect('Location', 'http://localhost:3200/error');
    });
  });
});
