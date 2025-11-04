import { Injectable } from '@nestjs/common';
import { CreateDataDto } from '../mqtt/dto/create-data.dto';
import { EnviromentalDataTimeseries } from 'src/entities/enviromental-data.timeseries.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class DataService {
  constructor(
    @InjectModel(EnviromentalDataTimeseries.name)
    private readonly dataModel: Model<EnviromentalDataTimeseries>,
  ) {}

  async create(createDataDto: CreateDataDto) {
    return await this.dataModel.create(createDataDto);
  }

  findAll() {
    return `This action returns all data`;
  }

  findOne(id: number) {
    return `This action returns a #${id} datum`;
  }

  remove(id: number) {
    return `This action removes a #${id} datum`;
  }
}
