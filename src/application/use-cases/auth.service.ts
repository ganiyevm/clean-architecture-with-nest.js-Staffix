// src/application/use-cases/auth.service.ts
import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IUserRepository } from '../../domain/interfaces/user-repository.interface';
import * as bcrypt from 'bcrypt';
import { MailService } from '../../infrastructure/services/mail.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailService,
  ) {}

  async findByEmail(dto_email: string): Promise<any> {
    const user = await this.userRepository.findByEmail(dto_email);
    if (!user) throw new UnauthorizedException('Email yoki parol xato');

    return user;
  }

  async validateUser(dto_email: string, dto_parol: string): Promise<any> {
    const user = await this.findByEmail(dto_email); // "REJECTED" олиб ташланди

    const isMatch = await bcrypt.compare(dto_parol, user.password);
    if (isMatch) {
      const payload = { id: user.id, email: user.email };
      return {
        access_token: this.jwtService.sign(payload),
      };
    }

    throw new UnauthorizedException('Email yoki parol xato');
  }

  async reset(password: string, token: string): Promise<any> {
    const decoded = this.jwtService.verify(token);
    const user = await this.userRepository.findById(decoded.userId);
    if (!user) throw new UnauthorizedException('Foydalanuvchi topilmadi');

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) throw new UnauthorizedException('Bu parol avval ishlatilган');

    const accessToken = this.jwtService.sign(
      { userId: user.id, email: user.email, secret: process.env.JWT_SECRET },
      { expiresIn: '1h' },
    );

    const resetLink = `https://example.com/reset-password?token=${accessToken}`;

    await this.mailerService.sendResetPasswordEmail(user.email, resetLink);

    return { message: 'Parolni tiklash havolasi emailga yuborildi!' };
  }
}