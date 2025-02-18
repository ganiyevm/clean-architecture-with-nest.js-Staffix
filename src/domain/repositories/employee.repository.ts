import { Employee } from '../entities/employee.entity';

export interface EmployeeRepository {
  findAll(): Promise<Employee[]>; 
  findById(id: string): Promise<Employee | null>;
  create(employee: Employee): Promise<Employee>;
}
