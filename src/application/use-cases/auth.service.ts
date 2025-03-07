import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IUserRepository } from '../../domain/repositories/user-repository.interface';
import { MailService } from 'src/infrastructure/services/mail.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from '../dtos/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailService,
  ) {}

  async login(dto: LoginDto): Promise<{ accessToken: string }> {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Email yoki parol xato');

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) throw new UnauthorizedException('Email yoki parol xato');

    const payload = { id: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }
  async sendPasswordResetEmail(email: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new Error('Foydalanuvchi topilmadi');

    const token = this.jwtService.sign(
      { userId: user.id },
      { secret: process.env.JWT_SECRET, expiresIn: '15m' },
    );

    const resetLink = `http://localhost:5173/reset-password?token=${token}`;
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Parolni tiklash',
      text: `Parolingizni tiklash uchun ushbu havolaga bosing: ${resetLink}`,
    });

    return { message: 'Parolni tiklash havolasi emailga yuborildi' };
  }
}
