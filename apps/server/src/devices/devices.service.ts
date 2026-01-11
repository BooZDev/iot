import { Injectable } from '@nestjs/common';
import { CreateDeviceDto } from './dto/create-device.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Device, PopulateDevice } from 'src/entities/device.entity';
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

  async findAllByGatewayId(gatewayId: string | Types.ObjectId) {
    return await this.deviceModel.find({ gatewayId }).exec();
  }

  async findAllByWarehouseId(warehouseId: string) {
    return await this.deviceModel
      .find({ warehouseId })
      .populate('gatewayId')
      .lean<PopulateDevice>()
      .exec();
  }

  async findOne(id: string) {
    return await this.deviceModel
      .findById(id)
      .populate('gatewayId')
      .lean<PopulateDevice>()
      .exec();
  }

  async findByMac(mac: string) {
    return await this.deviceModel.findOne({ mac }).exec();
  }

  async update(id: string, updateDeviceDto: Partial<UpdateDeviceDto>) {
    return await this.deviceModel
      .findByIdAndUpdate(id, updateDeviceDto, { new: true })
      .exec();
  }

  async remove(id: string) {
    return await this.deviceModel.findByIdAndDelete(id).exec();
  }
}
