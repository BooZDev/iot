import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSubDeviceDto } from './dto/create-sub-device.dto';
import { UpdateSubDeviceDto } from './dto/update-sub-device.dto';
import { InjectModel } from '@nestjs/mongoose';
import { PopulateSubDevice, SubDevice } from 'src/entities/sub-device.entity';
import { Model, Types } from 'mongoose';
import { DevicesService } from 'src/devices/devices.service';
import { Device } from 'src/entities/device.entity';

@Injectable()
export class SubDevicesService {
  constructor(
    @InjectModel(SubDevice.name)
    private readonly subDeviceModel: Model<SubDevice>,
    private readonly devicesService: DevicesService,
  ) {}

  async create(createSubDeviceDto: CreateSubDeviceDto) {
    const deviceId = await this.devicesService.findOne(
      createSubDeviceDto.deviceId,
    );

    if (!deviceId) {
      throw new NotFoundException('Không tìm thấy thiết bị cha với ID đã cho');
    }

    const createdSubDevice = new this.subDeviceModel(createSubDeviceDto);
    return createdSubDevice.save();
  }

  async findAll() {
    return await this.subDeviceModel.find().exec();
  }

  async findAllByDeviceId(deviceId: string | Types.ObjectId) {
    return await this.subDeviceModel.find({ deviceId }).exec();
  }

  async finAllByWarehouseId(warehouseId: string) {
    const subDevices = await this.subDeviceModel
      .find()
      .populate({
        path: 'deviceId',
        model: Device.name,
        select: 'gatewayId mac',
        populate: {
          path: 'gatewayId',
          model: Device.name,
          select: 'warehouseId mac',
        },
      })
      .lean<PopulateSubDevice[]>()
      .exec();

    return subDevices.filter((subDevice) => {
      return (
        subDevice.deviceId &&
        subDevice.deviceId.gatewayId &&
        subDevice.deviceId.gatewayId.warehouseId.toString() === warehouseId
      );
    });
  }

  async findOne(id: string) {
    return await this.subDeviceModel
      .findById(id)
      .populate({
        path: 'deviceId',
        model: Device.name,
        select: 'gatewayId mac',
        populate: {
          path: 'gatewayId',
          model: Device.name,
          select: 'warehouseId mac',
        },
      })
      .lean<PopulateSubDevice>()
      .exec();
  }

  update(id: string, updateSubDeviceDto: UpdateSubDeviceDto) {
    return this.subDeviceModel.findByIdAndUpdate(id, updateSubDeviceDto).exec();
  }

  remove(id: string) {
    return this.subDeviceModel.findByIdAndDelete(id).exec();
  }
}
