import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUserRepository } from '../../domain/repositories/user-repository.interface';
import { User } from '../../domain/entities/user.entity';
import { UserDocument } from '../database/schemas/user.schema';

@Injectable()
export class MongoUserRepository implements IUserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  private mapToDomain(userDocument: UserDocument): User {
    return {
      id: userDocument._id.toString(),
      email: userDocument.email,
      password: userDocument.password,
      fullName: userDocument.fullName,
      role: userDocument.role,
      googleId: userDocument.googleId,
    };
  }

  async create(user: User): Promise<User> {
    const createdUser = new this.userModel(user);
    const savedUser = await createdUser.save();
    return this.mapToDomain(savedUser); 
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userModel.findOne({ email }).exec();
    return user ? this.mapToDomain(user) : null; 
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.userModel.findById(id).exec();
    return user ? this.mapToDomain(user) : null; 
  }

  async findByGoogleId(googleId: string): Promise<User | null> {
    const user = await this.userModel.findOne({ googleId }).exec();
    return user ? this.mapToDomain(user) : null; 
  }

  async updatePassword(id: string, newPassword: string): Promise<boolean> {
    const result = await this.userModel.updateOne(
      { _id: id },
      { password: newPassword },
    );
    return result.modifiedCount > 0;
  }
}
