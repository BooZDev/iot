import { Injectable } from '@nestjs/common';
import { CreateDataDto } from '../mqtt/dto/create-data.dto';
import { EnviromentalDataTimeseries } from 'src/entities/enviromental-data.timeseries.schema';
import { Model, Types } from 'mongoose';
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

  async getHourlyAvgLast24h(deviceId: Types.ObjectId): Promise<
    {
      timestamp: Date;
      avgTemp: number;
      avgHum: number;
    }[]
  > {
    const end = new Date(new Date().getTime() + 7 * 60 * 60 * 1000);
    const start = new Date(end.getTime() - 24 * 60 * 60 * 1000);

    const match: Record<string, any> = {
      timestamp: { $gte: start, $lte: end },
    };

    match.metadata = deviceId;

    return await this.dataModel.aggregate([
      { $match: match },
      {
        $group: {
          _id: {
            year: { $year: '$timestamp' },
            month: { $month: '$timestamp' },
            day: { $dayOfMonth: '$timestamp' },
            hour: { $hour: '$timestamp' },
          },
          avgTemp: { $avg: '$data.temp' },
          avgHum: { $avg: '$data.hum' },
        },
      },
      {
        $project: {
          _id: 0,
          timestamp: {
            $dateFromParts: {
              year: '$_id.year',
              month: '$_id.month',
              day: '$_id.day',
              hour: '$_id.hour',
            },
          },
          avgTemp: { $round: ['$avgTemp', 2] },
          avgHum: { $round: ['$avgHum', 2] },
        },
      },
      { $sort: { timestamp: 1 } },
    ]);
  }

  async findOne(warehouseId: string) {
    return await this.dataModel.findOne({ warehouseId }).exec();
  }
}
