// src/infrastructure/modules/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule } from '../database/database.module'; // DatabaseModule импорт қилиш
import { AuthService } from '../../application/use-cases/auth.service';
import { MailService } from '../../infrastructure/services/mail.service';
import { MongoUserRepository } from '../repositories/mongo-user.repository';
@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'yourSecretKey',
      signOptions: { expiresIn: '1h' },
    }),
    DatabaseModule, // DatabaseModule импорт қилинган, шунда UserModel мавжуд бўлади
  ],
  providers: [
    AuthService,
    MailService,
    { provide: 'IUserRepository', useClass: MongoUserRepository }, // DatabaseModule дан олинган
  ],
  exports: [AuthService],
})
export class AuthModule {}