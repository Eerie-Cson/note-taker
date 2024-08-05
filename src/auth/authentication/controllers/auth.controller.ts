import { Controller, Get, Logger, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req: Request) {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(@Req() req: Request, @Res() res: Response) {
    try {
      const { user } = req;
      await this.authService.storeUser(user);
      const jwtToken = await this.authService.generateJwtToken(user);

      if (!user) {
        return res.redirect('http://localhost:3200/error');
      }

      return res.json({ token: jwtToken });
    } catch (err) {
      Logger.error(err);
      return res.redirect('http://localhost:3200/error');
    }
  }
}
