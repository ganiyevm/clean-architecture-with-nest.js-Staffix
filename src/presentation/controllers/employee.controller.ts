// src/presentation/controllers/employee.controller.ts
import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { EmployeeService } from '../../application/sevices/employee.service';
import { Employee } from '../../domain/entities/employee.entity';

@Controller('employees')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  async create(@Body() body: Partial<Employee>): Promise<Employee> {
    return this.employeeService.createEmployee(body);
  }

  @Get()
  async findAll(): Promise<Employee[]> {
    return this.employeeService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Employee | null> {
    const employee = await this.employeeService.findById(id);
    if (!employee) throw new Error('Employee not found');
    return employee;
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: Partial<Employee>,
  ): Promise<Employee | null> {
    const updatedEmployee = await this.employeeService.update(id, body);
    if (!updatedEmployee) throw new Error('Employee not found');
    return updatedEmployee;
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.employeeService.deleteEmployee(id);
  }
}