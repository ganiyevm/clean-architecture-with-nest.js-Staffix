// src/application/use-cases/employee.use-cases.module.ts
import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../../infrastructure/database/database.module'; // DatabaseModule импорт қилиш
import { CreateEmployeeUseCase } from '../../use-cases/employee_use-cases/create-employee.use-case';
import { DeleteEmployeeUseCase } from '../../use-cases/employee_use-cases/delete-employee.use-case';
import { MongoEmployeeRepository } from '../../../infrastructure/repositories/mongo-employee.repository';
@Module({
  imports: [
    DatabaseModule, // DatabaseModule импорт қилинган, шунда EmployeeModel мавжуд бўлади
  ],
  providers: [
    CreateEmployeeUseCase,
    DeleteEmployeeUseCase,
    { provide: 'EmployeeRepository', useClass: MongoEmployeeRepository }, // DatabaseModule дан олинган
  ],
  exports: [
    CreateEmployeeUseCase,
    DeleteEmployeeUseCase,
    'EmployeeRepository',
  ],
})
export class EmployeeUseCasesModule {}