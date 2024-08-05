import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './controllers/auth.controller';
import { GoogleStrategy } from './controllers/google.strategy';
import { UserModule } from '../../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtMiddleware } from '../../../libs/auth-middleware/jwt-middleware';

@Module({
  imports: [
    UserModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const secret = await config.get('JWT_SECRET');
        return {
          secret,
        };
      },
    }),
  ],

  providers: [AuthService, GoogleStrategy, JwtMiddleware],
  controllers: [AuthController],
})
export class AuthModule {}
