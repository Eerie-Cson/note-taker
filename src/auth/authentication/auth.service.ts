import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../user/user.service';
import { User } from '../../user/schema/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async storeUser(profile: any) {
    const { email, firstName, lastName } = profile.user;
    let user = await this.userService.findByEmail(email);

    if (!user) {
      user = await this.userService.createUser({
        email,
        firstName,
        lastName,
      });
    }
    return true;
  }

  async generateJwtToken(user: any) {
    const payload = { email: user.user.email };
    return this.jwtService.sign(payload, { expiresIn: '1h' });
  }

  async validateUser(payload: any): Promise<User | null> {
    const { email } = payload;
    return this.userService.findByEmail(email);
  }
}
