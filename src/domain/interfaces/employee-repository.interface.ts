// src/domain/interfaces/employee-repository.interface.ts
import { Employee } from '../entities/employee.entity';

export interface IEmployeeRepository {
  findAll(): Promise<Employee[]>;
  findById(id: string): Promise<Employee | null>;
  create(employee: Partial<Employee>): Promise<Employee>;
  update(id: string, employee: Partial<Employee>): Promise<Employee | null>;
  delete(id: string): Promise<void>;
}