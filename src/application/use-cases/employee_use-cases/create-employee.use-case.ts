// src/application/use-cases/employee-use-cases/create-employee.use-case.ts
import { Injectable, Inject } from '@nestjs/common'; // @Inject импорт қилиш
import { EmployeeRepository } from '../../../domain/repositories/employee.repository';
import { Employee } from '../../../domain/entities/employee.entity';

@Injectable()
export class CreateEmployeeUseCase {
  constructor(
    @Inject('EmployeeRepository')
    private readonly employeeRepository: EmployeeRepository,
  ) {}

  async execute(data: Partial<Employee>): Promise<Employee> {
    return this.employeeRepository.create(data);
  }
}