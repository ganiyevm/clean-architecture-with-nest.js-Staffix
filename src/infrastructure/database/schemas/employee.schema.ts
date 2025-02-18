import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EmployeeDocument = Employee & Document;

@Schema()
export class Employee {
  @Prop({ required: true })
  fullname: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  position: string;
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);
