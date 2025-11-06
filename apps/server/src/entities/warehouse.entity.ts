import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class Warehouse {
  @Prop({ type: String, required: true, unique: true })
  name: string;

  @Prop({ type: String, required: true })
  type: string;

  @Prop({ type: [Number, Number], required: false })
  locations: Array<number>;

  @Prop({ type: [Types.ObjectId], required: false })
  devices: Types.ObjectId[];
}

export const WarehouseSchema = SchemaFactory.createForClass(Warehouse);
