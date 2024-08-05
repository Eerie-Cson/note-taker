import { Injectable, ExecutionContext, CanActivate } from '@nestjs/common';

export const testToken = 'test-jwt-token';

export const mockAuthService = {
  storeUser: jest.fn().mockResolvedValue(true),
  generateJwtToken: jest.fn().mockResolvedValue(testToken),
};

@Injectable()
export class CustomAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    request.user = { email: 'test@example.com', name: 'Test User' };
    return true;
  }
}
