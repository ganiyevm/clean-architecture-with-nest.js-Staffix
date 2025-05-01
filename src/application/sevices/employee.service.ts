// src/application/services/employee.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { CreateEmployeeUseCase } from '../use-cases/employee_use-cases/create-employee.use-case';
import { DeleteEmployeeUseCase } from '../use-cases/employee_use-cases/delete-employee.use-case';
import { IEmployeeRepository } from '../../domain/interfaces/employee-repository.interface';
import { Employee } from '../../domain/entities/employee.entity';

@Injectable()
export class EmployeeService {
  constructor(
    private createEmployeeUseCase: CreateEmployeeUseCase,
    private deleteEmployeeUseCase: DeleteEmployeeUseCase,
    @Inject('EmployeeRepository') private employeeRepository: IEmployeeRepository,
  ) {}

  async createEmployee(data: Partial<Employee>): Promise<Employee> {
    return this.createEmployeeUseCase.execute(data);
  }

  async findAll(): Promise<Employee[]> {
    return this.employeeRepository.findAll();
  }

  async findById(id: string): Promise<Employee | null> {
    return this.employeeRepository.findById(id);
  }

  async update(id: string, data: Partial<Employee>): Promise<Employee | null> {
    return this.employeeRepository.update(id, data);
  }

  async deleteEmployee(id: string): Promise<void> {
    await this.deleteEmployeeUseCase.execute(id);
  }
}