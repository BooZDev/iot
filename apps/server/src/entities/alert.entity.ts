import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Warehouse } from './warehouse.entity';

@Schema({
  timestamps: true,
})
export class Alert {
  @Prop({ type: String, required: true })
  level: string;

  @Prop({ type: String, required: true })
  reason: string;

  @Prop({ type: Number, required: true })
  value: number;

  @Prop({ type: String, required: true })
  status: string;

  @Prop({ type: Types.ObjectId, required: true, ref: Warehouse.name })
  warehouseId: Types.ObjectId;
}

export const AlertSchema = SchemaFactory.createForClass(Alert);
