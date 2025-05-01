// src/infrastructure/database/database.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmployeeSchema } from '../database/schemas/employee.schema';
import { UserSchema } from '../database/schemas/user.schema';
import { MongoEmployeeRepository } from '../repositories/mongo-employee.repository';
import { MongoUserRepository } from '../repositories/mongo-user.repository';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/staffix', {
      autoCreate: true,
    }),
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
  exports: [
    'EmployeeRepository',
    'UserRepository',
    MongooseModule, // MongooseModule экспорт қилинган, шунда EmployeeModel ва UserModel глобал бўлади
  ],
})
export class DatabaseModule {}