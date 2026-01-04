import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Threshold } from 'src/entities/threshold.entity';
import { Model } from 'mongoose';
import { ThresholdType } from './enums/threshold.enum';

@Injectable()
export class ThresholdService {
  constructor(
    @InjectModel(Threshold.name) private thresholdModel: Model<Threshold>,
  ) {}

  async findAll() {
    return await this.thresholdModel.find().exec();
  }

  async findOne(warehouseId: string) {
    return await this.thresholdModel.findOne({ warehouseId }).exec();
  }

  async update(
    warehouseId: string,
    updateThresholdDto: { thresholds: ThresholdType; warehouseId: string },
  ) {
    return await this.thresholdModel
      .updateOne({ warehouseId }, updateThresholdDto, { upsert: true })
      .exec();
  }
}
