import { Injectable } from '@nestjs/common';
import { IUserRepository } from 'src/domain/repositories/user-repository.interface';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/infrastructure/services/mail.service';

@Injectable()
export class ResetPasswordUseCase {
  constructor(
    private readonly usersRepository: IUserRepository,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async execute(email: string): Promise<void> {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) throw new Error('User not found');

    const token = this.jwtService.sign({ userId: user.id }, { expiresIn: '15m' });
    await this.mailService.sendResetPasswordEmail(email, token);
  }
}