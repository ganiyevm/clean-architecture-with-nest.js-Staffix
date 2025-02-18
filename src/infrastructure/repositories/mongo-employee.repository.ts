import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EmployeeRepository } from '../../domain/repositories/employee.repository';
import { Employee } from '../../domain/entities/employee.entity';
import { EmployeeDocument } from '../database/schemas/employee.schema';

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
}
