import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from 'src/entities/user.entity';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async updateHashedRefreshToken(id: string, hashedRefreshToken: string) {
    return await this.userModel.findByIdAndUpdate(id, {
      hashedRefreshToken: hashedRefreshToken,
    });
  }

  async create(createUserDto: CreateUserDto) {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(createUserDto.password, salt);

    createUserDto.password = hashedPassword;

    const createdUser = new this.userModel(createUserDto);
    await createdUser.save();

    return { id: createdUser._id };
  }

  async findAll() {
    return this.userModel
      .find()
      .select('-password -hashedRefreshToken')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findById(id: string) {
    return this.userModel.findById(id).select('-password').exec();
  }

  async findByEmail(email: string) {
    const user = await this.userModel.findOne({ email }).exec();

    return user;
  }

  async rePassword(userId: string, newPassword: string) {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(newPassword, salt);

    return await this.userModel.findByIdAndUpdate(userId, {
      password: hashedPassword,
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userModel
      .findByIdAndUpdate(id, updateUserDto)
      .select('_id')
      .exec();

    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại.');
    }

    return { id: user._id };
  }

  delete(id: string) {
    return this.userModel.findByIdAndDelete(id).select('-password').exec();
  }
}
