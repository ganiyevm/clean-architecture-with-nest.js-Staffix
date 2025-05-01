// src/application/use-cases/employee-use-cases/delete-employee.use-case.ts
import { Injectable, Inject } from '@nestjs/common'; // @Inject импорт қилиш
import { EmployeeRepository } from '../../../domain/repositories/employee.repository';

@Injectable()
export class DeleteEmployeeUseCase {
  constructor(
    @Inject('EmployeeRepository')
    private readonly employeeRepository: EmployeeRepository,
  ) {}

  async execute(id: string): Promise<boolean> {
    const employee = await this.employeeRepository.findById(id);
    if (!employee) {
      throw new Error('Employee not found');
    }
    await this.employeeRepository.delete(id);
    return true;
  }
}