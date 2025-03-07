import { Employee } from '../entities/employee.entity';

export interface EmployeeRepository {
  findAll(): Promise<Employee[]>; 
  findById(id: string): Promise<Employee | null>;
  create(employee: Employee): Promise<Employee>;
  update(id: string, updateData: Partial<Employee>): Promise<Employee | null>;
  delete(id: string): Promise<boolean>;
}


