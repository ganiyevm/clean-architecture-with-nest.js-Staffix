// src/infrastructure/capcha/capcha.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class CapchaService {
  // CAPTCHA логикасини қўшиш
  generateCaptcha(): string {
    return 'captcha-code'; // Bu faqat misol
  }

  verifyCaptcha(code: string): boolean {
    return code === 'captcha-code'; // Bu faqat misol
  }
}