import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { NoteModule } from './note/notes.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/authentication/auth.module';
import { UserModule } from './user/user.module';
import { JwtMiddleware } from '../libs/auth-middleware/jwt-middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    MongooseModule.forRoot(process.env.MONGO_URI),
    NoteModule,
    AuthModule,
    UserModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes('api/notes');
  }
}
