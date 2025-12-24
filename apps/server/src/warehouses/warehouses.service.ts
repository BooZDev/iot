import { Injectable } from '@nestjs/common';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import { Warehouse } from 'src/entities/warehouse.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class WarehousesService {
  constructor(
    @InjectModel(Warehouse.name)
    private readonly warehouseModel: Model<Warehouse>,
  ) {}

  async create(createWarehouseDto: CreateWarehouseDto) {
    return await this.warehouseModel.create(createWarehouseDto);
  }

  async findAll() {
    return await this.warehouseModel.find().sort({ name: -1 }).exec();
  }

  async findOne(id: string) {
    return await this.warehouseModel.findById(id).exec();
  }

  async deactivateWarehouse(warehouseId: string) {
    return await this.warehouseModel.findByIdAndUpdate(warehouseId, {
      isActive: false,
    });
  }

  async update(id: string, updateWarehouseDto: UpdateWarehouseDto) {
    return await this.warehouseModel.findByIdAndUpdate(id, updateWarehouseDto);
  }

  remove(id: string) {
    return this.warehouseModel.findByIdAndDelete(id);
  }
}
