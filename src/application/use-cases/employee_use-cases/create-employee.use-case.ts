import { Injectable, Inject } from '@nestjs/common';
import { EmployeeRepository } from '../../../domain/repositories/employee.repository';
import { Employee } from '../../../domain/entities/employee.entity';

@Injectable()
export class CreateEmployeeUseCase {
  constructor(
    @Inject('EmployeeRepository')
    private readonly employeeRepository: EmployeeRepository,
  ) {}

  async execute(employee: Employee): Promise<Employee> {
    return this.employeeRepository.create(employee);
  }
  async findAll(): Promise<Employee[]> {
    return this.employeeRepository.findAll();
  }
  async findById(id: string): Promise<Employee | null> {
    return this.employeeRepository.findById(id);
  }
  async delete(id: string): Promise<void> {
    await this.employeeRepository.delete(id);
  }
  async update(id: string, updateData: Partial<Employee>): Promise<Employee> {
    return this.employeeRepository.update(id, updateData);
  }
}
