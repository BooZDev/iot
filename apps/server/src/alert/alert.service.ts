import { Injectable } from '@nestjs/common';
import { CreateAlertDto } from './dto/create-alert.dto';
import { UpdateAlertDto } from './dto/update-alert.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Alert } from 'src/entities/alert.entity';
import { Model } from 'mongoose';

@Injectable()
export class AlertService {
  constructor(@InjectModel(Alert.name) private alertModel: Model<Alert>) {}

  async create(createAlertDto: CreateAlertDto) {
    return await this.alertModel.create(createAlertDto);
  }

  async findAll() {
    return await this.alertModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne() {
    return await this.alertModel.findOne().exec();
  }

  async update(id: string, updateAlertDto: UpdateAlertDto) {
    return await this.alertModel
      .findByIdAndUpdate({ warehouseId: id }, updateAlertDto)
      .exec();
  }
}
