// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { EmployeeController } from './presentation/controllers/employee.controller';
import { EmployeeUseCasesModule } from './application/use-cases/employee_use-cases/employee.use-cases.module';
import { EmployeeService } from './application/sevices/employee.service';
import { AuthService } from './application/use-cases/auth.service';
import { LoggerService } from './infrastructure/utils/logger.service';
import { AuthModule } from './infrastructure/modules/auth.module';
import { DatabaseModule } from './infrastructure/database/database.module';
import { CapchaService } from './infrastructure/capcha/capcha.service';
import { CapchaController } from './infrastructure/capcha/capcha.controller';
import { MailService } from './infrastructure/services/mail.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'yourSecretKey',
      signOptions: { expiresIn: '1h' },
    }),
    EmployeeUseCasesModule,
    AuthModule,
    DatabaseModule, // DatabaseModule импорт қилинган
  ],
  controllers: [EmployeeController, CapchaController],
  providers: [
    EmployeeService,
    AuthService,
    LoggerService,
    CapchaService,
    MailService,
  ],
})
export class AppModule {}