import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from '../../application/use-cases/auth/login-user.use-case';
import { AuthController } from '../../presentation/controllers/auth.controller';
import { DatabaseModule } from './database.module'; 
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from '../../application/use-cases/auth/google.strategy';
import { MailService } from 'src/infrastructure/services/mail.service';





@Module({
  imports: [PassportModule,
    DatabaseModule, 
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default_secret', 
      signOptions: { expiresIn: '3600s' },
    }),
  ],
  providers: [AuthService,GoogleStrategy,MailService],
  controllers: [AuthController,MailService],
  exports: [AuthService],
})
export class AuthModule {}
