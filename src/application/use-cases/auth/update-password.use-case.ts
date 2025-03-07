import { Injectable } from '@nestjs/common';
import { IUserRepository } from 'src/domain/repositories/user-repository.interface';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UpdatePasswordUseCase {
  constructor(
    private readonly usersRepository: IUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(token: string, newPassword: string): Promise<void> {
    const payload = this.jwtService.verify(token);
    if (!payload) throw new Error('Invalid or expired token');

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.usersRepository.updatePassword(payload.userId, hashedPassword);
  }
}