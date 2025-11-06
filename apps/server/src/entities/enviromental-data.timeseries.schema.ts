import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import type { DataType } from 'src/mqtt/types/data.type';

@Schema({
  timestamps: false,
  versionKey: false,
  collection: 'enviromental_data',
  expireAfterSeconds: 5,
  timeseries: {
    timeField: 'timestamp',
    metaField: 'metadata',
    granularity: 'seconds',
  },
})
export class EnviromentalDataTimeseries {
  @Prop({ type: Date, required: true })
  timestamp: Date;

  @Prop({
    type: Types.ObjectId,
    required: true,
    ref: 'Devices',
  })
  metadata: Types.ObjectId;

  @Prop({ type: Object, required: true })
  data: DataType;
}

export const EnviromentalDataTimeseriesSchema = SchemaFactory.createForClass(
  EnviromentalDataTimeseries,
);
