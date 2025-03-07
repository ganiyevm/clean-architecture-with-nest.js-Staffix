import { Controller, Get, Post, Body, Query, Session } from '@nestjs/common';
import { CaptchaService } from '../captcha/captcha.service';

@Controller('captcha')
export class CaptchaController {
  constructor(private readonly captchaService: CaptchaService) {}

  @Get()
  getCaptcha(@Session() session) {
    return this.captchaService.generateCaptcha(session.id);
  }

  @Post('validate')
  validateCaptcha(@Session() session, @Body('answer') answer: number) {
    const isValid = this.captchaService.validateCaptcha(session.id, answer);
    return { success: isValid };
  }
}
