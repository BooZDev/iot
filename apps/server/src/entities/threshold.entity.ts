import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import type { ThresholdType } from 'src/threshold/enums/threshold.enum';

@Schema({
  timestamps: true,
})
export class Threshold {
  @Prop({ type: Object, required: true })
  thresholds: ThresholdType;

  @Prop({ type: Types.ObjectId, required: true })
  warehouseId: Types.ObjectId;
}

export const ThresholdSchema = SchemaFactory.createForClass(Threshold);
