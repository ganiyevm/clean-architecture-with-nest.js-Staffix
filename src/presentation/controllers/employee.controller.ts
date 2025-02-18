import { Controller, Post, Body } from '@nestjs/common';
import { CreateEmployeeDto } from '../../application/dtos/create-employee.dto';  
import { CreateEmployeeUseCase } from '../../application/use-cases/create-employee.use-case'; 


@Controller('employees')  
export class EmployeeController {
  constructor(private readonly createEmployeeUseCase: CreateEmployeeUseCase) {}

  @Post()
  createEmployee(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.createEmployeeUseCase.execute(createEmployeeDto);
  }
}
