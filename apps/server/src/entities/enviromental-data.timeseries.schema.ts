import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: false,
  versionKey: false,
  collection: 'enviromental_data',
  expireAfterSeconds: 5, // 7 days
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
    type: {
      deviceId: { type: String, required: true },
      location: { type: String, required: true },
    },
    required: true,
  })
  metadata: {
    deviceId: string;
    location: string;
  };

  @Prop({ type: Number, required: true })
  temperature: number;

  @Prop({ type: Number, required: true })
  humidity: number;

  @Prop({ type: Number, required: true })
  gas: number;

  @Prop({ type: Number, required: true })
  lux: number;
}

export const EnviromentalDataTimeseriesSchema = SchemaFactory.createForClass(
  EnviromentalDataTimeseries,
);
