import { JwtAuthGuard } from '@common/guards/JWTGuard/jwt-auth.guard';
import type { LoginType } from '@modules/auth/types/login.type';
import type { LogoutType } from '@modules/auth/types/logout.type';
import type { RefreshTokenType } from '@modules/auth/types/refresh-token.type';
import type { RegisterType } from '@modules/auth/types/register.type';
import { Body, Controller, Ip, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginData: LoginType, @Ip() ip: string) {
    return this.authService.login(loginData, ip);
  }

  @Post('register')
  async register(@Body() registerData: RegisterType, @Ip() ip: string) {
    return this.authService.register(registerData, ip);
  }

  @Post('refresh-token')
  async refreshToken(@Body() refreshTokenData: RefreshTokenType) {
    return this.authService.refreshToken(refreshTokenData);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Body('refreshToken') logoutData: LogoutType) {
    return this.authService.logout(logoutData);
  }
}
