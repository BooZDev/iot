import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from 'src/entities/user.entity';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<Types.ObjectId> {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(createUserDto.password, salt);

    createUserDto.password = hashedPassword;

    const createdUser = new this.userModel(createUserDto);
    await createdUser.save();

    return createdUser._id;
  }

  async findAll() {
    return this.userModel
      .find()
      .select('-password')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findById(id: Types.ObjectId) {
    return this.userModel.findById(id).select('-password').exec();
  }

  async findByEmail(email: string) {
    const user = await this.userModel.findOne({ email }).exec();

    if (!user) {
      throw new Error(`Không thấy người dùng có email: ${email}.`);
    }

    return user;
  }

  async update(id: Types.ObjectId, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(updateUserDto.password, salt);

      updateUserDto.password = hashedPassword;
    }

    const user = await this.userModel
      .findByIdAndUpdate(id, updateUserDto)
      .select('_id')
      .exec();

    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại.');
    }

    return user;
  }

  delete(id: Types.ObjectId) {
    return this.userModel.findByIdAndDelete(id).select('-password').exec();
  }
}
