
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, NotFoundException } from '@nestjs/common'; 
import { Model } from 'mongoose';
import { EmployeeRepository } from '../../domain/repositories/employee.repository';
import { Employee } from '../../domain/entities/employee.entity';
import { EmployeeDocument } from '../database/schemas/employee.schema';

@Injectable()
export class MongoEmployeeRepository implements EmployeeRepository {
  constructor(
    @InjectModel('Employee') private readonly employeeModel: Model<EmployeeDocument>,
  ) {}

  async findAll(): Promise<Employee[]> {
    const employees = await this.employeeModel.find().exec();
    return employees.map(emp => ({
      id: emp._id.toString(),
      fullname: emp.fullname,
      email: emp.email,
      position: emp.position,
    }));
  }

  async findById(id: string): Promise<Employee | null> {
    const emp = await this.employeeModel.findById(id).exec();
    if (!emp) return null;
    return {
      id: emp._id.toString(),
      fullname: emp.fullname,
      email: emp.email,
      position: emp.position,
    };
  }

  async create(employee: Employee): Promise<Employee> {
    const createdEmployee = new this.employeeModel(employee);
    const savedEmployee = await createdEmployee.save();
    return {
      id: savedEmployee._id.toString(),
      fullname: savedEmployee.fullname,
      email: savedEmployee.email,
      position: savedEmployee.position,
    };
  }

  async update(id: string, updateData: Partial<Employee>): Promise<Employee> {
    const updatedEmployee = await this.employeeModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }, 
    ).exec();
    
    if (!updatedEmployee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }
  
    return {
      id: updatedEmployee._id.toString(),
      fullname: updatedEmployee.fullname,
      email: updatedEmployee.email,
      position: updatedEmployee.position,
    };
  }

  

  async delete(id: string): Promise<boolean> {
    const result = await this.employeeModel.findByIdAndDelete(id).exec();
    return !!result; 
  }
}
