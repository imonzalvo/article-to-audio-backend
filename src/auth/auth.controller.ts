import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('google/callback')
  async googleAuthCallback(@Body() body: { id_token: string; access_token: string }) {
    try {
        console.log("here 1")
      const user = await this.authService.validateGoogleToken(body.id_token);
      const jwt = this.authService.generateJwt(user);
      console.log("generated token!!", jwt)
      return { success: true, user, token: jwt };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}
