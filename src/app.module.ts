import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmployeeController } from './presentation/controllers/employee.controller';
import { CreateEmployeeUseCase } from './application/use-cases/employee_use-cases/create-employee.use-case';
import { DeleteEmployeeUseCase } from './application/use-cases/employee_use-cases/delete-employee.use-case';
import { LoggerService } from './infrastructure/utils/logger.service';
import { AuthModule } from './infrastructure/modules/auth.module';
import { DatabaseModule } from './infrastructure/modules/database.module'; 
import { ConfigModule } from '@nestjs/config';
import { CaptchaService } from './captcha/captcha.service';
import { CaptchaController } from './captcha/captcha.controller';
import { AuthService } from 'src/application/use-cases/auth.service';
import { MailService } from './infrastructure/services/mail.service';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/staffixx'),
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule, 
    AuthModule, 
  ],
  controllers: [EmployeeController, CaptchaController],
  providers: [
    LoggerService,
    CreateEmployeeUseCase,
    DeleteEmployeeUseCase,
    CaptchaService,
    AuthService,
    MailService,
  ],
  exports: [LoggerService,MailService],
})
export class AppModule {}
