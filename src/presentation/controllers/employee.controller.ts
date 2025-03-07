import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CreateEmployeeDto } from '../../application/dtos/create-employee.dto';
import { CreateEmployeeUseCase } from '../../application/use-cases/employee_use-cases/create-employee.use-case';
import { LoggerService } from '../../infrastructure/utils/logger.service';
import { MongoError } from 'mongodb';
import { DeleteEmployeeUseCase } from 'src/application/use-cases/employee_use-cases/delete-employee.use-case';
import { NotFoundException } from '@nestjs/common';

@Controller('employees')
export class EmployeeController {
  constructor(
    private readonly createEmployeeUseCase: CreateEmployeeUseCase,
    private readonly loggerService: LoggerService,
    private readonly deleteEmployeeUseCase: DeleteEmployeeUseCase,
  ) {}

  @Post()
  async createEmployee(@Body() createEmployeeDto: CreateEmployeeDto) {
    try {
      const employee =
        await this.createEmployeeUseCase.execute(createEmployeeDto);
      this.loggerService.log(`Employee yaratildi: ${JSON.stringify(employee)}`);
      return employee.id;
    } catch (error) {
      if (error instanceof MongoError && error.code === 11000) {
        //
        this.loggerService.error('Email allaqachon mavjud', error.stack);
        throw new HttpException(
          'Bunday email allaqachon mavjud',
          HttpStatus.BAD_REQUEST,
        );
      }
      this.loggerService.error(
        'Employee yaratishda xatolik yuz berdi',
        error.stack,
      );
      throw new HttpException(
        'Ichki server xatosi',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async findAllEmployees() {
    try {
      const employees = await this.createEmployeeUseCase.findAll();
      return employees;
    } catch (error) {
      this.loggerService.error(
        'Barcha employee larni olishda xatolik yuz berdi',
        error.stack,
      );
      throw new HttpException(
        'Ichki server xatosi',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async findEmployeeById(@Param('id') id: string) {
    try {
      const employee = await this.createEmployeeUseCase.findById(id);
      if (!employee) {
        this.loggerService.error(`Employee ID ${id} topilmadi`);
        throw new HttpException('Employee topilmadi', HttpStatus.NOT_FOUND);
      }
      return employee;
    } catch (error) {
      this.loggerService.error(
        `Employee ID ${id} bo‘yicha olishda xatolik`,
        error.stack,
      );
      throw new HttpException(
        'Ichki server xatosi',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id')
  async updateEmployee(
    @Param('id') id: string,
    @Body() updateData: Partial<CreateEmployeeDto>,
  ) {
    try {
      const updatedEmployee = await this.createEmployeeUseCase.update(
        id,
        updateData,
      );
      if (!updatedEmployee) {
        this.loggerService.error(`Employee ID ${id} yangilash uchun topilmadi`);
        throw new HttpException('Employee topilmadi', HttpStatus.NOT_FOUND);
      }
      this.loggerService.log(
        `Employee ID ${id} yangilandi: ${JSON.stringify(updatedEmployee)}`,
      );
      return updatedEmployee;
    } catch (error) {
      this.loggerService.error(
        `Employee ID ${id} yangilashda xatolik yuz berdi`,
        error.stack,
      );
      throw new HttpException(
        'Ichki server xatosi',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  async deleteEmployee(@Param('id') id: string) {
    try {
      const deleted: boolean = await this.deleteEmployeeUseCase.execute(id);

      if (!deleted) {
        throw new NotFoundException('Employee not found');
      }

      this.loggerService.log(`Employee ID ${id} o‘chirildi`);
      return { message: 'Employee o‘chirildi', id };
    } catch (error) {
      this.loggerService.error(
        `Employee ID ${id} ni o‘chirishda xatolik yuz berdi`,
        error.stack,
      );
      throw new HttpException(
        'Ichki server xatosi',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
