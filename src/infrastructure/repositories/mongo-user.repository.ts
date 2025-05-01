// src/infrastructure/repositories/mongo-user.repository.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUserRepository } from '../../domain/interfaces/user-repository.interface';
import { User } from '../../domain/entities/user.entity';

@Injectable()
export class MongoUserRepository implements IUserRepository {
  constructor(@InjectModel('User') private userModel: Model<User>) {}

  async findByEmail(email: string): Promise<User | null> {
    try {
      return await this.userModel.findOne({ email }).lean().exec();
    } catch (error) {
      throw new InternalServerErrorException('Failed to find user by email');
    }
  }

  async findById(id: string): Promise<User | null> {
    try {
      return await this.userModel.findById(id).lean().exec();
    } catch (error) {
      throw new InternalServerErrorException('Failed to find user by ID');
    }
  }

  async create(user: Partial<User>): Promise<User> {
    try {
      const savedUser = await this.userModel.create(user);
      return savedUser.toObject();
    } catch (error) {
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async update(id: string, user: Partial<User>): Promise<User | null> {
    try {
      const updatedUser = await this.userModel
        .findByIdAndUpdate(id, user, { new: true })
        .lean()
        .exec();
      return updatedUser;
    } catch (error) {
      throw new InternalServerErrorException('Failed to update user');
    }
  }
}