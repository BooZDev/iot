import { Module } from '@nestjs/common';
import { DataService } from './data.service';
import { DataController } from './data.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  EnviromentalDataTimeseries,
  EnviromentalDataTimeseriesSchema,
} from 'src/entities/enviromental-data.timeseries.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: EnviromentalDataTimeseries.name,
        schema: EnviromentalDataTimeseriesSchema,
      },
    ]),
  ],
  controllers: [DataController],
  providers: [DataService],
  exports: [DataService],
})
export class DataModule {}
