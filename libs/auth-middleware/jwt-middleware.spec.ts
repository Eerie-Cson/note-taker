import { JwtMiddleware } from './jwt-middleware';
import * as jwt from 'jsonwebtoken';
import { UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
}));

describe('JwtMiddleware', () => {
  let jwtMiddleware: JwtMiddleware;
  const mockRequest: Partial<Request> = {};
  const mockResponse: Partial<Response> = {};
  const nextFunction: NextFunction = jest.fn();

  beforeEach(() => {
    jwtMiddleware = new JwtMiddleware();
  });

  it('should throw UnauthorizedException if token is not provided', () => {
    mockRequest.headers = {};

    expect(() =>
      jwtMiddleware.use(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction,
      ),
    ).toThrow(new UnauthorizedException('Token not found'));
  });

  it('should throw UnauthorizedException if token is invalid', () => {
    const token = 'invalid-token';
    mockRequest.headers = { authorization: `Bearer ${token}` };

    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid token');
    });

    expect(() =>
      jwtMiddleware.use(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction,
      ),
    ).toThrow(new UnauthorizedException('Invalid token'));
  });

  it('should attach user to request and call next if token is valid', () => {
    const token = 'valid-token';
    const decodedToken = { userId: '123', username: 'testuser' };
    mockRequest.headers = { authorization: `Bearer ${token}` };

    (jwt.verify as jest.Mock).mockReturnValue(decodedToken);

    jwtMiddleware.use(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction,
    );

    expect(mockRequest.user).toEqual(decodedToken);
    expect(nextFunction).toHaveBeenCalled();
  });
});
