import { AuthService } from '../../application/use-cases/auth/login-user.use-case';
import { LoginDto } from '../../application/dtos/auth.dto';
import { Controller, Get, Req, UseGuards,Post, Body  } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ResetPasswordDto, UpdatePasswordDto } from 'src/application/dtos/reset-password.dto';
import { ResetPasswordUseCase } from 'src/application/use-cases/auth/reset-password.use-case';
import { UpdatePasswordUseCase } from 'src/application/use-cases/auth/update-password.use-case';


@Controller('auth')
export class AuthController {
  constructor
  ( private readonly authService: AuthService,
    private readonly resetPasswordUseCase: ResetPasswordUseCase,
    private readonly updatePasswordUseCase: UpdatePasswordUseCase,) {}

  @Post('login')
  async login(@Body()  LoginDto) {
    return this.authService.login(LoginDto);
  }
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // Google autentifikatsiyasiga yo'naltirish
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req) {
    return {
      message: 'Google login successful!',
      user: req.user,
    };
  }
  @Post('reset-password')
  async resetPassword(@Body() { email }: ResetPasswordDto) {
    await this.resetPasswordUseCase.execute(email);
    return { message: 'Password reset email sent' };
  }

  @Post('update-password')
  async updatePassword(@Body() { token, newPassword }: UpdatePasswordDto) {
    await this.updatePasswordUseCase.execute(token, newPassword);
    return { message: 'Password updated successfully' };
  }
}
