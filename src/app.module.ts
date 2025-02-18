import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmployeeController } from './presentation/controllers/employee.controller';
import { CreateEmployeeUseCase } from './application/use-cases/create-employee.use-case';
import { MongoEmployeeRepository } from './infrastructure/repositories/mongo-employee.repository';
import { EmployeeSchema } from './infrastructure/database/schemas/employee.schema';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/staffixx'),
    MongooseModule.forFeature([{ name: 'Employee', schema: EmployeeSchema }])
  ],
  controllers: [EmployeeController],
  providers: [
    CreateEmployeeUseCase,
    {
      provide: 'EmployeeRepository',
      useClass: MongoEmployeeRepository,
    },
  ],
})
export class AppModule {}
