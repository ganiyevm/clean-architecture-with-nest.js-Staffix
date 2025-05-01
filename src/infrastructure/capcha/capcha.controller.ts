// src/infrastructure/capcha/capcha.controller.ts
import { Controller, Get, Post, Body } from '@nestjs/common';
import { CapchaService } from './capcha.service';

@Controller('captcha')
export class CapchaController {
  constructor(private readonly capchaService: CapchaService) {}

  @Get()
  getCaptcha(): string {
    return this.capchaService.generateCaptcha();
  }

  @Post('verify')
  verifyCaptcha(@Body('code') code: string): boolean {
    return this.capchaService.verifyCaptcha(code);
  }
}