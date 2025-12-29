import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Warehouse {
  @Prop({ type: String, required: true, unique: true })
  name: string;

  @Prop({ type: String, required: true })
  type: string;

  @Prop({ type: [[Number, Number]], required: false })
  locations: [number, number][];

  @Prop({ type: Array, required: false })
  description: [string, string];

  @Prop({ type: String, required: false })
  address: string;

  @Prop({ type: String, required: false })
  imageUrl: string;

  @Prop({ type: Boolean, required: true, default: true })
  isActive: boolean;
}

export const WarehouseSchema = SchemaFactory.createForClass(Warehouse);
