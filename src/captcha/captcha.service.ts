import { Injectable } from '@nestjs/common';

@Injectable()
export class CaptchaService {
  private captchaStore = new Map<string, number>();

  generateCaptcha(sessionId: string) {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const operator = ['+', '-', '*'][Math.floor(Math.random() * 3)];

    const expression = `${num1} ${operator} ${num2}`;
    const result = eval(expression); // Natijani hisoblaymiz

    this.captchaStore.set(sessionId, result); // Sessiya bo‘yicha natijani saqlaymiz
    return { expression };
  }

  validateCaptcha(sessionId: string, userAnswer: number): boolean {
    const correctAnswer = this.captchaStore.get(sessionId);
    this.captchaStore.delete(sessionId); // Captcha faqat bir marta ishlatilishi kerak
    return correctAnswer === userAnswer;
  }
}
