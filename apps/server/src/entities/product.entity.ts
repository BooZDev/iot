import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Warehouse } from './warehouse.entity';

@Schema({
  timestamps: true,
})
export class Product {
  @Prop({ type: String, required: true, unique: true })
  productCode: string;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  category: string;

  @Prop({ type: Number, required: true })
  quantity: number;

  @Prop({ type: String, required: true })
  unit: string;

  @Prop({ type: String, required: true, default: 'READY_IN' })
  status: string;

  @Prop({ type: Types.ObjectId, required: true, ref: Warehouse.name })
  warehouseId: Types.ObjectId;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
