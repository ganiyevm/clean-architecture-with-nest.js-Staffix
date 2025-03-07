import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmployeeSchema } from '../database/schemas/employee.schema';
import { UserSchema } from '../database/schemas/user.schema'; 
import { MongoEmployeeRepository } from '../repositories/mongo-employee.repository';
import { MongoUserRepository } from '../repositories/mongo-user.repository'; 

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Employee', schema: EmployeeSchema },
      { name: 'User', schema: UserSchema }, 
    ]),
  ],
  providers: [
    {
      provide: 'EmployeeRepository',
      useClass: MongoEmployeeRepository,
    },
    {
      provide: 'UserRepository',
      useClass: MongoUserRepository, 
    },
  ],
  exports: ['EmployeeRepository', 'UserRepository'], 
})
export class DatabaseModule {}
