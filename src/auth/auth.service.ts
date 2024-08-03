import { Injectable } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private google: OAuth2Client;

  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {
    this.google = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
    );
  }

  async validateGoogleToken(token: string) {
    try {
      const ticket = await this.google.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      const user = await this.userService.findOrCreate({
        email: payload?.email,
        firstName: payload?.given_name,
        lastName: payload?.family_name,
        picture: payload?.picture,
      });
      return user;
    } catch (err) {
      throw new Error('Invalid Google token');
    }
  }

  generateJwt(user: any) {
    const payload = { email: user.email, sub: user._id };
    return this.jwtService.sign(payload);
  }
}

