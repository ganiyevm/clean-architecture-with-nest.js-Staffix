import { EmployeeRepository } from '../../domain/repositories/employee.repository';
import { Employee } from '../../domain/entities/employee.entity';

export class CreateEmployeeUseCase {
  constructor(private readonly employeeRepository: EmployeeRepository) {}

  async execute(employee: Employee): Promise<Employee> {
    return this.employeeRepository.create(employee);
  }
}
