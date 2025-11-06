import { Injectable } from '@nestjs/common';
import { CreateDeviceDto } from './dto/create-device.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Device } from 'src/entities/device.entity';
import { Model, Types } from 'mongoose';
import { UpdateDeviceDto } from './dto/update-device.dto';

@Injectable()
export class DevicesService {
  constructor(@InjectModel(Device.name) private deviceModel: Model<Device>) {}

  async create(createDeviceDto: CreateDeviceDto) {
    return await this.deviceModel.create(createDeviceDto);
  }

  async findAll() {
    return await this.deviceModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: Types.ObjectId) {
    return await this.deviceModel.findById(id).exec();
  }

  async findbyDeviceId(id: string) {
    return await this.deviceModel.findOne({ deviceId: id }).exec();
  }

  async update(id: Types.ObjectId, updateDeviceDto: Partial<UpdateDeviceDto>) {
    return await this.deviceModel.findByIdAndUpdate(id, updateDeviceDto).exec();
  }

  async remove(id: Types.ObjectId) {
    return await this.deviceModel.findByIdAndDelete(id).exec();
  }
}
