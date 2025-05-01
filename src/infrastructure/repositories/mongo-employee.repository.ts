// src/infrastructure/repositories/mongo-employee.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Employee } from '../../domain/entities/employee.entity';
import { IEmployeeRepository } from '../../domain/interfaces/employee-repository.interface';

@Injectable()
export class MongoEmployeeRepository implements IEmployeeRepository {
  constructor(@InjectModel('Employee') private employeeModel: Model<Employee>) {} // "Employee" номи DatabaseModule да аниқлангани билан мос бўлиши керак

  async findAll(): Promise<Employee[]> {
    return this.employeeModel.find().lean().exec();
  }

  async findById(id: string): Promise<Employee | null> {
    return this.employeeModel.findById(id).lean().exec();
  }

  async create(employee: Partial<Employee>): Promise<Employee> {
    const savedEmployee = await this.employeeModel.create(employee);
    return savedEmployee.toObject();
  }

  async update(id: string, employee: Partial<Employee>): Promise<Employee | null> {
    const updatedEmployee = await this.employeeModel
      .findByIdAndUpdate(id, employee, { new: true })
      .lean()
      .exec();
    return updatedEmployee;
  }

  async delete(id: string): Promise<void> {
    await this.employeeModel.findByIdAndDelete(id).exec();
  }
}