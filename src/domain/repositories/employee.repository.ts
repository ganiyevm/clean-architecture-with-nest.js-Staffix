// src/domain/repositories/employee.repository.ts
import { Injectable } from '@nestjs/common';
import { IEmployeeRepository } from '../interfaces/employee-repository.interface';
import { Employee } from '../entities/employee.entity';

@Injectable()
export class EmployeeRepository implements IEmployeeRepository {
  findAll(): Promise<Employee[]> {
    throw new Error('Method not implemented.');
  }

  findById(id: string): Promise<Employee | null> {
    throw new Error('Method not implemented.');
  }

  create(employee: Partial<Employee>): Promise<Employee> {
    throw new Error('Method not implemented.');
  }

  update(id: string, employee: Partial<Employee>): Promise<Employee | null> {
    throw new Error('Method not implemented.');
  }

  delete(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}